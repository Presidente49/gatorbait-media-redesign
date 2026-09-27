import json
N=[0]
def nid():
    N[0]+=1; return f"t{N[0]}"
def txt(t, dec=None): return {"type":"TEXT","id":"","nodes":[],"textData":{"text":t,"decorations":dec or []}}
def para(*runs): return {"type":"PARAGRAPH","id":nid(),"nodes":list(runs),"paragraphData":{}}
def p(t): return para(txt(t))
def h(t, lvl=3): return {"type":"HEADING","id":nid(),"nodes":[txt(t)],"headingData":{"level":lvl}}
B=[{"type":"BOLD","fontWeightValue":700}]
I=[{"type":"ITALIC","italicData":True}]
def link(t,url): return txt(t,[{"type":"LINK","linkData":{"link":{"url":url,"target":"SELF"}}}])
def img(i,w,hh,alt,cap,size="CONTENT"):
    return {"type":"IMAGE","id":nid(),"nodes":[],"imageData":{"containerData":{"width":{"size":size},"alignment":"CENTER"},
      "image":{"src":{"id":i},"width":w,"height":hh},"altText":alt,"caption":cap}}
def quote(t): return {"type":"BLOCKQUOTE","id":nid(),"nodes":[para(txt(t))],"blockquoteData":{}}
CR="Photo by Chris Spears, GatorBait Media"
n=[]
n.append(para(txt("Column | By Chris Spears, GatorBait Media",I)))
n.append(p("Florida 52, Ole Miss 28. The scoreboard told you who won. The sideline told you what kind of team you're watching."))
n.append(h("1. Florida has an identity again."))
n.append(p("The Gators want to run the football. Line up, lean on you and find out whether you still want to tackle Jadan Baugh in the fourth quarter. Florida ran for 302 yards against the No. 4 team in the country."))
n.append(img("d3cfa5_026d2a4d2be04a91b8c32317fed5f623~mv2.jpg",1471,838,"Jadan Baugh dives for a touchdown against Ole Miss in Ben Hill Griffin Stadium.",f"Jadan Baugh dives in for the first touchdown of the day. {CR}"))
n.append(h("2. Jadan Baugh is the compass."))
n.append(p("Twenty-nine carries, 142 yards, three touchdowns. It was his fifth straight 100-yard game, which puts him alongside Emmitt Smith and Fred Taylor as the only Gators to do that. When Florida needs four yards, everybody knows who's getting the ball. He usually gets six."))
n.append(img("d3cfa5_9b92c9cd699d46a7a5c56db9a21317e5~mv2.jpg",800,500,"Jadan Baugh celebrates in the end zone after a touchdown against Ole Miss.",f"Baugh in the end zone, one of his three touchdowns. {CR}"))
n.append(h("3. Duke Clark means no intermission."))
n.append(p("You survive Baugh, he trots off, and Duke Clark walks in: 12 carries, 126 yards. That's not a backup. That's another problem. His 45-yard touchdown came right after Ole Miss had cut the lead to 17-14 and thought it was climbing back in."))
n.append(quote("“I thought Duke played out of his mind, and he’s got all the ability in the world.” — Jon Sumrall"))
n.append(h("4. Aaron Philo doesn't have to be the hero."))
n.append(p("He went 16 of 23 for 196 yards with a touchdown pass and a touchdown run. He didn't try to win every snap; he won the next play. There's maturity in handing it to No. 13 and getting out of the way."))
n.append(img("d3cfa5_7b3962151a0247bfaad98911c4c4353b~mv2.jpg",800,454,"Florida quarterback Aaron Philo with teammates on the field after the win over Ole Miss.",f"Aaron Philo (12) with teammates after the final whistle. {CR}"))
n.append(h("5. This team takes a punch."))
n.append(p("Ole Miss punched back. Twice it got scary, at 17-14 and again at 24-21. There was no panic on Florida's sideline. The Gators scored touchdowns on their first five possessions of the second half. Old Florida teams treated adversity like a warning. This team treats it like part of Saturday."))
n.append(img("d3cfa5_47123317aa9e4b4e8a5097d8bc81ae0b~mv2.jpg",800,534,"Jadan Baugh stretches across the goal line against Ole Miss.",f"Baugh stretches for the goal line. {CR}"))
n.append(h("6. Special teams were quietly loud."))
n.append(p("London Montgomery's 74-yard kickoff return came right after Ole Miss pulled within 24-21, and Florida needed only three plays to score. Montgomery averaged 42.7 yards on three returns. Hidden yards become very visible by November."))
n.append(h("7. The defense made the plays that mattered."))
n.append(p("It wasn't a masterpiece. Trinidad Chambliss threw for 298 yards. But Jayden Woods' strip-sack, recovered by Myles Graham, set up another touchdown and changed the temperature of the game. DJ Coleman added a fourth-quarter interception. Good defenses are judged by moments."))
n.append(h("8. Vernell Brown III changes the shape of the field."))
n.append(p("His speed backs safeties up and opens everything underneath for Baugh and Clark. He tweaked a knee late in the second quarter, and Jon Sumrall said afterward that nothing is torn but it's too early to know about next week. The full offense needs him healthy. Something to watch."))
n.append(img("d3cfa5_7acdfecf6f3d45289bbdcc93f3ca970c~mv2.jpg",800,494,"Vernell Brown III runs down the sideline in front of the Florida cheerleaders against Ole Miss.",f"Vernell Brown III (1) turns on the speed down the sideline. {CR}"))
n.append(h("9. The Swamp sounded like The Swamp."))
n.append(p("Third downs felt different. Big runs sounded different. The crowd didn't come to be entertained; it participated. A great home-field advantage still makes 11 men feel like 12."))
n.append(img("d3cfa5_ce8defc3525b4e74a6a394170740c270~mv2.jpg",1024,652,"Jon Sumrall leads the Gators onto the field at Ben Hill Griffin Stadium.",f"Jon Sumrall leads the Gators out. {CR}"))
n.append(h("10. Florida finished like it belongs."))
n.append(p("Up 38-28, the Gators didn't sit on it. They attacked. Touchdown. Then another. The No. 4 team in the country wasn't trying to steal one; it was trying to get out of Gainesville."))
n.append(img("d3cfa5_cf3c6da48f1a41e48eea9484d677f784~mv2.jpg",1080,1920,"Florida players celebrate the 52-28 win over Ole Miss.",f"Final: Florida 52, Ole Miss 28. {CR}","SMALL"))
n.append(p("The scoreboard said 52-28. The sideline said these Gators are growing up faster than anybody expected."))
n.append(para(txt("More from The Swamp: ",I), link("Baugh Game: the full game story","https://www.gatorbaitmedia.com/post/florida-ole-miss-final-baugh-gators-run-over-rebels"), txt(" · ",I), link("Sumrall's postgame press conference","https://www.gatorbaitmedia.com/post/sumrall-postgame-press-conference-ole-miss-not-fully-awake")))
dp={"title":"10 Thoughts From the Sidelines: Florida 52, Ole Miss 28",
 "excerpt":"Photographer Chris Spears had the best seat in The Swamp. Ten things the sideline told him about the Florida team that ran over No. 4 Ole Miss.",
 "seoSlug":"chris-spears-10-thoughts-from-the-sidelines-florida-ole-miss",
 "memberId":"16433bab-ee11-4e09-9f6c-cac7a12ec042",
 "categoryIds":["a4577921-a2e9-41bb-8a5d-4a9c56f2eb5b"],
 "media":{"wixMedia":{"image":{"id":"d3cfa5_2ea58f38e2da4c988ab73065cfe63130~mv2.jpg","width":1620,"height":1080,"altText":"The Florida Gators take the field against Ole Miss in Ben Hill Griffin Stadium. Photo by Chris Spears."}},"displayed":True,"custom":True},
 "richContent":{"nodes":n}}
json.dump({"draftPost":dp,"publish":True},open("draftPost-publish.json","w"),ensure_ascii=False)
print(len(json.dumps(dp)), sum(1 for x in n if x["type"]=="IMAGE"))
