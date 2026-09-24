import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location('catalog', ROOT/'scripts/catalog.py')
cat=importlib.util.module_from_spec(SPEC);SPEC.loader.exec_module(cat)

class CatalogTests(unittest.TestCase):
    def test_registry_unique(self):
        rows=json.loads((ROOT/'catalog/repos.json').read_text())['repositories']
        self.assertEqual(len(rows),len({r['id'] for r in rows}))
        self.assertEqual(len(rows),len({r['repository'].lower() for r in rows}))
    def test_each_source_has_skill(self):
        for r in json.loads((ROOT/'catalog/repos.json').read_text())['repositories']:
            text=(ROOT/'commands'/f"{r['id']}.md").read_text()
            self.assertIn(r['repository'],text);self.assertIn('repository-intake.md',text)
    def test_pending_no_invented_commands(self):
        for r in json.loads((ROOT/'catalog/repos.json').read_text())['repositories']:
            if r['review']=='SOURCE_REVIEW_REQUIRED': self.assertEqual([],r['documented_commands'])
    def test_no_installation_claims(self):
        for r in json.loads((ROOT/'catalog/repos.json').read_text())['repositories']:
            self.assertEqual('HOST_UNVERIFIED',r['installation_state'])
    def test_reviewed_sources_have_doc_hash(self):
        for r in json.loads((ROOT/'catalog/repos.json').read_text())['repositories']:
            if r['review']=='INSTALL_REFERENCE_REVIEWED': self.assertRegex(r['source_blob'],r'^[0-9a-f]{40}$')
    def test_native_plugin_self_contained(self):
        manifest=json.loads((ROOT/'.claude-plugin/plugin.json').read_text())
        self.assertEqual('business-operations',manifest['name'])
        self.assertTrue((ROOT/'SKILL.md').is_file())
        self.assertNotIn('skills',manifest);self.assertFalse((ROOT/'skills').exists())
        for forbidden in ('mcpServers','hooks','dependencies','monitors','permissionMode'): self.assertNotIn(forbidden,manifest)
        self.assertFalse((ROOT/'.mcp.json').exists())
    def test_review_roles_are_read_only(self):
        agents=list((ROOT/'agents').glob('*.md'));self.assertEqual(3,len(agents))
        for p in agents:
            text=p.read_text();self.assertIn('tools: Read, Grep, Glob\n',text);self.assertIn('maxTurns: 8',text)
            for field in ('permissionMode:', 'mcpServers:', 'hooks:', 'background:'):self.assertNotIn(field,text)
    def test_no_automatic_install(self):
        self.assertIn('disable-model-invocation: true',(ROOT/'commands/install-repo.md').read_text())
        self.assertFalse(json.loads((ROOT/'catalog/repos.json').read_text())['automatic_installation'])
    def test_extract_deduplicates_formats(self):
        self.assertEqual(['owner/repo'],cat.extract('https://github.com/owner/repo/blob/main/a github:owner/repo git@github.com:owner/repo.git'))
    def test_ignore_github_not_repository(self):
        self.assertEqual([],cat.extract('https://github.com/settings/profile https://github.com/orgs/team'))
    def test_sensitive_and_traversal_skipped(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)
            for name in ('.env','.env.example','secrets.txt','cookie-cache.md','../oops.md','/tmp/a.md','.shared-memory/note.md','node_modules/readme.md'):
                self.assertIsNone(cat.safe_file(root,name))
    def test_symlink_skipped(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);(root/'a.md').write_text('test');(root/'link.md').symlink_to(root/'a.md')
            self.assertIsNone(cat.safe_file(root,'link.md'))
    def test_scan_is_scoped_to_tracked_text(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);subprocess.run(['git','init','-q',d],check=True)
            (root/'doc.md').write_text('https://github.com/owner/repo')
            (root/'other.md').write_text('https://github.com/hidden/repo')
            (root/'.env').write_text('https://github.com/private/repo')
            subprocess.run(['git','-C',d,'add','doc.md','.env'],check=True)
            result=cat.scan(root)
            self.assertEqual(['owner/repo'],[r['repository'] for r in result['candidates']]);self.assertEqual(1,result['files_skipped'])
    def test_unknown_catalog_id_fails(self):
        p=subprocess.run(['python3',str(ROOT/'scripts/catalog.py'),'--repo','not-there'],capture_output=True)
        self.assertEqual(2,p.returncode)

if __name__=='__main__':unittest.main()
