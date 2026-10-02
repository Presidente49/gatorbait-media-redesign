#!/usr/bin/env python3
"""Lean Friday Pregame email: the Magazine cover image is the star. Logo header, cover, two buttons, in-this-issue links.
Usage: build-email-lean.py <cover-image-url> [--test]"""
import sys, pathlib, html
COVER = sys.argv[1]; TEST = '--test' in sys.argv
S = 'https://www.gatorbaitmedia.com'; M = S + '/magazine'
FRANZ = S + '/post/the-soothsayer-gators-head-to-missouri-where-history-hasn-t-been-kind'
LOGO = 'https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp/v1/fit/w_600,h_160,q_90/file.png'
NAVY, ORANGE, MUTE = '#081F3D', '#FA4616', '#4B586A'
items = [('Franz Beard: Gators head to Missouri, where history hasn’t been kind', FRANZ),
         ('The Sooth Board: every SEC game, picked', M),
         ('Three keys and who is out for Florida at Missouri', M),
         ('Buddy Martin: Coaches and Fans Have Different Playbooks', S + '/post/coaches-and-fans-have-different-playbooks-so-have-another-round-thirsty-gators'),
         ('A first look at No. 25 Missouri', S + '/post/first-look-missouri-florida-gators-show-me-state-of-mind')]
lis = ''.join('<mj-text padding="0 0 10px" font-size="16px" line-height="1.35"><a href="%s" style="color:%s;font-weight:800;text-decoration:none;">&#9656; %s</a></mj-text>' % (u, NAVY, html.escape(t)) for t, u in items)
m = ['<mjml><mj-head><mj-title>GatorBait Magazine: Friday Pregame, Florida at Missouri</mj-title><mj-preview>Franz Beard leads the Friday pregame edition. Florida at Missouri, Saturday at 3:30 p.m. ET on ABC.</mj-preview>'
     '<mj-attributes><mj-all font-family="Arial, Helvetica, sans-serif" /><mj-text color="#11274A" font-size="16px" line-height="1.5" /><mj-button background-color="%s" color="#FFFFFF" border-radius="3px" font-size="16px" font-weight="800" /></mj-attributes></mj-head><mj-body background-color="#EEF1F5">' % ORANGE]
if TEST: m.append('<mj-section background-color="%s" padding="8px 16px"><mj-column><mj-text align="center" color="#FFFFFF" font-size="13px" font-weight="800" padding="0">TEST EMAIL for Brenden only. Not sent to the list.</mj-text></mj-column></mj-section>' % ORANGE)
m.append('<mj-section background-color="#FFFFFF" padding="18px 24px 14px" border-bottom="4px solid %s"><mj-column><mj-image src="%s" alt="GatorBait" width="260px" href="%s" padding="0" /></mj-column></mj-section>' % (ORANGE, LOGO, M))
m.append('<mj-section background-color="%s" padding="0"><mj-column><mj-image src="%s" alt="GatorBait Magazine cover: Gators head to Missouri, where history hasn’t been kind. Photo by Chris Spears, GatorBait Media." href="%s" padding="0" width="600px" /></mj-column></mj-section>' % (NAVY, COVER, M))
m.append('<mj-section background-color="#FFFFFF" padding="22px 24px 8px"><mj-column><mj-text color="%s" font-size="17px" padding="0 0 8px">No. 8 Florida is 2-4 in Columbia since 2012 and has to find an emotional peak right after the biggest win in years. Franz Beard asks if the Gators are tough enough.</mj-text>'
         '<mj-button href="%s" padding="14px 0 6px">OPEN THE FULL MAGAZINE</mj-button><mj-button href="%s" background-color="%s" padding="6px 0 12px">READ FRANZ&#8217;S COLUMN</mj-button></mj-column></mj-section>' % (MUTE, M, FRANZ, NAVY))
m.append('<mj-section background-color="#FFFFFF" padding="6px 24px 22px"><mj-column><mj-divider border-color="#dde3ec" border-width="1px" padding="0 0 14px" /><mj-text color="%s" font-size="12px" font-weight="900" letter-spacing="2px" padding="0 0 10px">IN THIS ISSUE</mj-text>%s</mj-column></mj-section>' % (ORANGE, lis))
m.append('<mj-section background-color="%s" padding="18px 24px"><mj-column><mj-text align="center" color="#D7E0EB" font-size="13px" line-height="1.7" padding="0"><a href="%s" style="color:#D7E0EB;">GatorBait Media</a> &#183; Independent Florida Gators coverage%s</mj-text></mj-column></mj-section></mj-body></mjml>' % (NAVY, S, '<br/>You are receiving this test from GatorBait Media.' if TEST else ''))
pathlib.Path(__file__).resolve().parent.joinpath('friday-pregame-lean.mjml').write_text('\n'.join(m))
