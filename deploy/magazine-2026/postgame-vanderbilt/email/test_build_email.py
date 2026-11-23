import json
import shutil
import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
BUILDER = HERE / 'build_email.py'
ISSUE = ROOT / 'sports-live/magazine-issue-vanderbilt-postgame.json'


class CoverEmailTest(unittest.TestCase):
    def test_checked_in_email_matches_builder(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'current.mjml'
            subprocess.run([sys.executable, BUILDER, output], check=True, cwd=directory)
            self.assertEqual(output.read_bytes(), (HERE / 'email.mjml').read_bytes())

    def test_updated_cover_follows_issue_while_primary_links_stay_on_magazine(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            builder = root / BUILDER.relative_to(ROOT)
            issue_path = root / ISSUE.relative_to(ROOT)
            builder.parent.mkdir(parents=True)
            issue_path.parent.mkdir()
            shutil.copyfile(BUILDER, builder)
            issue = json.loads(ISSUE.read_text())
            image = issue['cover']['image']
            image.update(id='badabc_' + '2' * 32, ext='png',
                         alt='A "new" cover & crowd.', credit='Photo by A & B.')
            issue_path.write_text(json.dumps(issue))
            output = root / 'email.mjml'
            pdf = 'https://www.gatorbaitmedia.com/downloads/edition.pdf'
            subprocess.run([sys.executable, builder, output, 'MONDAY', pdf, '23 pages'],
                           check=True, cwd=directory)
            doc = ET.parse(output)
            hero = doc.find('.//mj-image')
            self.assertEqual(hero.get('src'), f"https://static.wixstatic.com/media/{image['id']}~mv2.png")
            self.assertEqual(hero.get('alt'), image['alt'])
            caption = doc.find(".//mj-text[@css-class='gz-credit']")
            self.assertEqual(caption.text, image['alt'] + ' ' + image['credit'])
            cta = doc.find('.//mj-body//mj-button')
            for link in [hero, cta]:
                url = urlsplit(link.get('href'))
                self.assertEqual((url.scheme, url.netloc, url.path),
                                 ('https', 'www.gatorbaitmedia.com', '/magazine'))
            self.assertEqual(doc.findall('.//mj-button')[-1].get('href'), pdf)
            self.assertIn('23 pages', output.read_text())


if __name__ == '__main__':
    unittest.main()
