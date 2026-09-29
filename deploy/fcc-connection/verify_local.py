#!/usr/bin/env python3
"""Start the pinned local FCC gateway, verify it, then stop it. No model calls."""
import json
from datetime import datetime, timezone
import os
from pathlib import Path
import shutil
import socket
import subprocess
import time
import urllib.error
import urllib.request


def main():
    root = Path.home() / ".fcc"
    config = root / ".env"
    values = dict(
        line.split("=", 1)
        for line in config.read_text().splitlines()
        if "=" in line and not line.lstrip().startswith("#")
    )
    values = {key.strip(): value.strip().strip('"') for key, value in values.items()}
    assert values["HOST"] == "127.0.0.1", "FCC must bind only to loopback"
    assert values["PORT"] == "8082", "Unexpected FCC port"
    assert values["PROXY_AUTH_ENABLED"].lower() == "true", "Proxy auth required"
    assert root.stat().st_mode & 0o777 == 0o700, "Config directory must be 0700"
    assert config.stat().st_mode & 0o777 == 0o600, "Config file must be 0600"
    token = values["ANTHROPIC_AUTH_TOKEN"]
    assert len(token) >= 32, "Expected private local bearer token"
    executable = Path.home() / ".local/bin/fcc-server"
    version = subprocess.check_output([str(executable), "--version"], text=True).strip()
    assert version == "free-claude-code 6.2.31", "Unexpected FCC version"
    with socket.socket() as sock:
        sock.settimeout(1)
        assert sock.connect_ex(("127.0.0.1", 8082)) != 0, "Existing gateway: inspect before starting another"

    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))

    def read(path, authenticated=False):
        headers = {"Authorization": "Bearer " + token} if authenticated else {}
        request = urllib.request.Request("http://127.0.0.1:8082" + path, headers=headers)
        try:
            with opener.open(request, timeout=20) as response:
                return response.status, json.loads(response.read())
        except urllib.error.HTTPError as error:
            return error.code, json.loads(error.read())

    log_fd = os.open(root / "gatorbait-verification.log", os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o600)
    process = None
    with os.fdopen(log_fd, "a") as log:
        try:
            environment = dict(os.environ, HOST="127.0.0.1", PORT="8082", PROXY_AUTH_ENABLED="true", FCC_OPEN_BROWSER="false")
            process = subprocess.Popen([str(executable)], cwd=root, env=environment,
                                       stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT)
            for _ in range(80):
                if process.poll() is not None:
                    raise RuntimeError("FCC stopped during startup; inspect private log")
                try:
                    health_code, health = read("/health")
                    break
                except urllib.error.URLError:
                    time.sleep(0.25)
            else:
                raise RuntimeError("Gateway did not start within 20 seconds")

            unauthenticated_code, _ = read("/v1/models")
            models_code, models = read("/v1/models?view=responses", authenticated=True)
            status_code, status = read("/admin/api/status")
            assert health_code == 200 and health["status"] == "healthy"
            assert unauthenticated_code == 401, "Unauthenticated model access must fail"
            assert models_code == 200 and status_code == 200
            assert status["host"] == "127.0.0.1" and status["port"] == 8082
            selected = next(p for p in status["provider_status"] if p["provider_id"] == status["provider"])
            report = {
                "verified_at_utc": datetime.now(timezone.utc).isoformat(),
                "fcc_version": version,
                "gateway_health_http": health_code,
                "models_without_auth_http": unauthenticated_code,
                "models_with_auth_http": models_code,
                "listen_host": status["host"],
                "listen_port": status["port"],
                "configured_model": status["model"],
                "advertised_model_ids": [item["id"] for item in models.get("data", [])],
                "selected_provider": status["provider"],
                "selected_provider_status": selected["status"],
                "missing_configuration_keys": selected.get("missing_configuration_keys", []),
                "provider_completion_tested": False,
                "native_codex_installed": shutil.which("codex") is not None,
                "native_claude_installed": shutil.which("claude") is not None,
                "config_permissions": "0600",
                "config_directory_permissions": "0700",
                "lifecycle": "temporary test gateway; stopped after checks",
            }
            print(json.dumps(report, indent=2))
        finally:
            if process and process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()


if __name__ == "__main__":
    main()
