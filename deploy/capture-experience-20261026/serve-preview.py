"""Serve this no-submit review page at / so editorial-route behavior is faithful."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]


class Preview(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path == "/":
            self.path = "/deploy/capture-experience-20261026/index.html"
        elif self.path in ("/capture-candidate.js", "/current-header-preview.css"):
            self.path = "/deploy/capture-experience-20261026" + self.path
        super().do_GET()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8766
    print(f"Local no-submit preview: http://127.0.0.1:{port}/", flush=True)
    ThreadingHTTPServer(("127.0.0.1", port), Preview).serve_forever()
