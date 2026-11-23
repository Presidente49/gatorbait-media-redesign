import html
import json
import re
import sys
from pathlib import Path
SITE='https://www.gatorbaitmedia.com'
def u(path,content): return SITE+path+'?utm_source=gatorbait_gazette_alert&#38;utm_medium=email&#38;utm_campaign=postgame_magazine&#38;utm_content='+content
MAG=lambda c: u('/magazine',c)
TITLE='Florida 34, Vanderbilt 27: The GatorBait Postgame Magazine'
PRE="The game story, Buddy Martin, Franz Beard and Eddie Gilley on the win, 126 photos from Chris Spears, the box score and a PDF for your phone."
DATE=sys.argv[2] if len(sys.argv)>2 else 'SUNDAY, NOV. 22, 2026'
PDF=sys.argv[3] if len(sys.argv)>3 else '{{PDF_URL}}'
PDFNOTE=sys.argv[4] if len(sys.argv)>4 else '22 pages, 2.1 MB'
STORIES=[
 ('GATORBAIT STAFF · GAME STORY','Baugh Control: No. 24 Florida rallies past Vanderbilt 34-27 on Senior Day',"Jadan Baugh's 10-yard run with 2:18 left finished the comeback from a 24-17 halftime deficit.",'/post/baugh-control-no-24-florida-rallies-past-vanderbilt-34-27-on-senior-day','game_story'),
 ('BUDDY MARTIN · COLUMN','Some Days You Need Your Gator Fortune Cookie to Crumble Your Way. It Did.','Two breaks, a helmet on the turf and a tipped ball.','/post/some-days-you-need-your-gator-fortune-cookie-to-crumble-your-way-it-did','buddy_fortune'),
 ('FRANZ BEARD · COLUMN','No logic, no reason, just a bizarre Florida win','A lucky bounce, a helmet on the turf and a last-minute sack, plus the SEC scoreboard.','/post/no-logic-no-reason-just-a-bizarre-florida-win','franz_bizarre'),
 ('BUDDY MARTIN · COLUMN',"Jon Sumrall Says It's Time for Gator Football to Say Thanks.",'Gratitude, barbecue and a 7-4 team headed to Tallahassee.','/post/jon-sumrall-says-it-s-time-for-gator-football-to-say-thanks','buddy_thanks'),
 ('EDDIE GILLEY · AREA EVALUATIONS','Area Evaluations: Florida vs. Vanderbilt','The weather, the turf, the cleats and the atmosphere in the Swamp, graded.','/post/area-evaluations-florida-vs-vanderbilt','eddie_areas'),
 ('GATORBAIT STAFF · REACTION',"Sumrall after the comeback: 'We are a train wreck at times'",'What Jon Sumrall, Aaron Philo and Myles Graham said after the win.','/post/sumrall-after-the-comeback-we-are-a-train-wreck-at-times','reaction'),
 ('GATORBAIT STAFF · RECEIVERS','The Receiving Room Keeps Answering','Eric Singleton Jr. had 117 yards against Vanderbilt.','/post/seven-games-without-vb3-and-still-no-word-on-a-return','receivers'),
 ('CHRIS SPEARS · PHOTOS',"Chris Spears' Best Shots: Florida 34, Vanderbilt 27",'His best shots, plus the full gallery of 126 photos.','/post/chris-spears-best-shots-florida-34-vanderbilt-27','gallery'),
]
def story(lab,title,dek,path,c):
    return f'''    <mj-section background-color="#FFFFFF" padding="0 28px 8px" css-class="gz-pad">
      <mj-column>
        <mj-text padding="0 0 3px" color="#5F6B7A" font-size="12px" font-weight="700" letter-spacing="1px" line-height="1.3">{html.escape(lab,quote=False)}</mj-text>
        <mj-text padding="0 0 4px" color="#081B35" font-size="20px" font-weight="800" line-height="1.18"><a href="{u(path,c)}" style="color:#081B35;text-decoration:none;">{html.escape(title,quote=False)}</a></mj-text>
        <mj-text padding="0 0 6px" color="#27364F" font-size="16px" line-height="1.45">{html.escape(dek,quote=False)}</mj-text>
        <mj-divider border-color="#D5DCE6" border-width="1px" padding="6px 0 0" />
      </mj-column>
    </mj-section>
'''
# Keep the mailed photo in sync with the source used by the Vanderbilt reader.
issue_path = Path(__file__).resolve().parents[4] / 'sports-live/magazine-issue-vanderbilt-postgame.json'
issue = json.loads(issue_path.read_text(encoding='utf-8'))
cover = issue['cover']
image = cover['image']
media_id = image['id']
extension = (image.get('ext') or 'jpg').lower()
if not re.fullmatch(r'[0-9a-f]+_[0-9a-f]{32}', media_id) or extension not in ('jpg', 'jpeg', 'png', 'webp', 'avif'):
    raise ValueError('Invalid Wix media ID or extension in magazine cover')
alt = image['alt'].strip()
credit = image['credit'].strip()
if not alt or not credit:
    raise ValueError('Magazine cover needs descriptive alt text and a photo credit')
HERO = f'https://static.wixstatic.com/media/{media_id}~mv2.{extension}'
ALT = html.escape(alt, quote=True)
CAP = html.escape(alt if alt.endswith(credit) else f'{alt} {credit}', quote=False)
out=f'''<mjml lang="en" dir="ltr">
  <mj-head>
    <mj-title>{TITLE}</mj-title>
    <mj-preview>{PRE}</mj-preview>
    <mj-font name="Barlow" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&amp;display=swap" />
    <mj-attributes>
      <mj-all font-family="Barlow, Arial, Helvetica, sans-serif" />
      <mj-text color="#14243D" font-size="16px" line-height="1.5" />
      <mj-button background-color="#FA4616" color="#FFFFFF" border-radius="0" inner-padding="16px 30px" font-size="16px" font-weight="800" letter-spacing="1px" />
    </mj-attributes>
    <mj-style>
      :root {{ color-scheme: light; supported-color-schemes: light; }}
      .gz-credit {{ font-style: italic; }}
      @media only screen and (max-width: 480px) {{
        .gz-wordmark {{ font-size: 38px !important; }}
        .gz-headline {{ font-size: 30px !important; line-height: 1.08 !important; }}
        .gz-pad {{ padding-left: 18px !important; padding-right: 18px !important; }}
      }}
    </mj-style>
  </mj-head>
  <mj-body background-color="#E9EDF3" width="600px">
    <mj-section background-color="#040E1E" padding="7px 22px" css-class="gz-pad">
      <mj-group>
        <mj-column width="58%" padding="0">
          <mj-text padding="0" color="#C9D4E4" font-size="11px" font-weight="700" letter-spacing="1.4px" line-height="1.4">{DATE}</mj-text>
        </mj-column>
        <mj-column width="42%" padding="0">
          <mj-text padding="0" align="right" color="#FA7A45" font-size="11px" font-weight="800" letter-spacing="1.4px" line-height="1.4">POSTGAME MAGAZINE</mj-text>
        </mj-column>
      </mj-group>
    </mj-section>
    <mj-section background-color="#081B35" padding="24px 22px 6px" css-class="gz-pad">
      <mj-column>
        <mj-text align="center" padding="0" color="#FFFFFF" font-size="46px" font-weight="800" letter-spacing="1px" line-height="1" css-class="gz-wordmark">GATOR<span style="color:#FA4616;">BAIT</span></mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#081B35" padding="0 22px 4px" css-class="gz-pad">
      <mj-column>
        <mj-divider border-color="#FA4616" border-width="3px" padding="8px 0 0" />
        <mj-text align="center" padding="8px 0 2px" color="#FFFFFF" font-size="15px" font-weight="800" letter-spacing="9px" line-height="1.2">THE GAZETTE</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#081B35" padding="0 22px 16px" css-class="gz-pad">
      <mj-column>
        <mj-divider border-color="#5E7396" border-width="1px" padding="6px 0 8px" />
        <mj-text align="center" padding="0" color="#A9B8D0" font-size="11px" font-weight="600" letter-spacing="1.8px" line-height="1.4">FLORIDA FOOTBALL ALL THE TIME. · OLD SCHOOL JOURNALISM. NEW TECH.</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#FFFFFF" padding="26px 28px 4px" css-class="gz-pad">
      <mj-column>
        <mj-text padding="0 0 8px" color="#D8450C" font-size="13px" font-weight="800" letter-spacing="2px" line-height="1.2">FLORIDA FOOTBALL</mj-text>
        <mj-text padding="0 0 12px" color="#081B35" font-size="38px" font-weight="800" line-height="1.06" letter-spacing="-0.3px" css-class="gz-headline"><a href="{MAG('headline')}" style="color:#081B35;text-decoration:none;">{TITLE}</a></mj-text>
        <mj-text padding="0 0 14px" color="#5F6B7A" font-size="13px" font-weight="700" letter-spacing="1px" line-height="1.3">BY GATORBAIT MEDIA</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#FFFFFF" padding="0">
      <mj-column>
        <mj-image src="{HERO}" alt="{ALT}" href="{MAG('cover')}" padding="0" fluid-on-mobile="true" />
      </mj-column>
    </mj-section>
    <mj-section background-color="#FFFFFF" padding="7px 28px 0" css-class="gz-pad">
      <mj-column>
        <mj-text padding="0" color="#6B7686" font-size="12px" line-height="1.35" css-class="gz-credit">{CAP}</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#FFFFFF" padding="18px 28px 6px" css-class="gz-pad">
      <mj-column>
        <mj-text padding="0 0 18px" color="#27364F" font-size="19px" line-height="1.5">Florida came from 24-17 down at the half to beat Vanderbilt on Senior Day. The game story, the columns, the box score, how the game swung and what Jon Sumrall said afterward, all in one place.</mj-text>
        <mj-button href="{MAG('open_magazine')}" align="left" padding="0 0 8px" width="100%">OPEN THE MAGAZINE &#8594;</mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#FFFFFF" padding="0 28px 6px" css-class="gz-pad">
      <mj-column>
        <mj-text padding="0 0 10px" color="#D8450C" font-size="13px" font-weight="800" letter-spacing="2px" line-height="1.2">IN THIS ISSUE</mj-text>
      </mj-column>
    </mj-section>
'''+''.join(story(*s) for s in STORIES)+f'''    <!-- PDF -->
    <mj-section background-color="#FFFFFF" padding="12px 28px 6px" css-class="gz-pad">
      <mj-column>
        <mj-text padding="0 0 6px" color="#D8450C" font-size="13px" font-weight="800" letter-spacing="2px" line-height="1.2">KEEP THE WHOLE ISSUE</mj-text>
        <mj-text padding="0 0 14px" color="#27364F" font-size="16px" line-height="1.45">The full postgame magazine as a PDF sized for your phone: {PDFNOTE}.</mj-text>
        <mj-button href="{PDF}" background-color="#081B35" align="left" padding="0 0 8px" width="100%">DOWNLOAD THE PDF &#8595;</mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#FFFFFF" padding="6px 28px 24px" css-class="gz-pad">
      <mj-column>
        <mj-divider border-color="#081B35" border-width="3px" padding="0" />
        <mj-divider border-color="#081B35" border-width="1px" padding="3px 0 0" />
      </mj-column>
    </mj-section>
    <mj-section background-color="#081B35" padding="22px 28px 22px" css-class="gz-pad">
      <mj-column>
        <mj-text align="center" padding="0 0 8px" color="#FFFFFF" font-size="17px" font-weight="800" letter-spacing="1px">GATOR<span style="color:#FA4616;">BAIT</span> MEDIA</mj-text>
        <mj-text align="center" padding="0 0 10px" color="#C9D4E4" font-size="13px" line-height="1.5">You're getting this because you signed up for GatorBait Magazine and GatorBait Media news. <a href="{u('','footer_home')}" style="color:#FFFFFF;font-weight:700;">Read more on GatorBaitMedia.com</a></mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>'''
open(sys.argv[1],'w').write(out); print('chars',len(out))
