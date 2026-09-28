import json
N=[0]
def nid():
    N[0]+=1; return f"m{N[0]}"
def txt(t,dec=None): return {"type":"TEXT","id":"","nodes":[],"textData":{"text":t,"decorations":dec or []}}
def p(t): return {"type":"PARAGRAPH","id":nid(),"nodes":[txt(t)],"paragraphData":{}}
def h(t): return {"type":"HEADING","id":nid(),"nodes":[txt(t)],"headingData":{"level":2}}
I=[{"type":"ITALIC","italicData":True}]
n=[
 {"type":"PARAGRAPH","id":nid(),"nodes":[txt("By GatorBait Media Staff",I)],"paragraphData":{}},
 p("GAINESVILLE — The party in The Swamp lasted exactly one night. Florida is No. 8 in both polls, 4-0 and 2-0 in the SEC, and the reward is a trip to Columbia, Mo., to face a Missouri team that let one get away on Saturday night."),
 p("No. 8 Florida plays at No. 25 Missouri on Saturday, Oct. 3, at 3:30 p.m. ET. The AP game preview lists ABC as the broadcast. It is Missouri’s homecoming."),
 h("What happened to Missouri"),
 p("The Tigers (3-1, 0-1 SEC) led No. 24 Mississippi State 24-17 in the third quarter in Starkville and lost 31-24. Kamario Taylor led two fourth-quarter touchdown drives for the Bulldogs, the second capped by a 24-yard pass to Sanfrisco Magee with 3:57 left. Missouri’s last shot, a Hail Mary from the Mississippi State 38, was broken up in the end zone."),
 p("“It’s life in the SEC,” Missouri coach Eli Drinkwitz said, according to the Associated Press. “That game on the road is going to be challenging. You just have to fight and find a way to win.”"),
 p("Before that, Missouri beat Arkansas-Pine Bluff 54-14, won 38-21 at Kansas and beat Troy 27-17."),
 h("Who to watch"),
 p("Quarterback Austin Simmons is the headliner. He has thrown for 947 yards and 11 touchdowns without an interception, and he threw for 295 yards and three scores at Mississippi State. Receiver Cayden Lee had 11 catches for 156 yards and two touchdowns in that game. Running back Jamal Roberts leads the Tigers with 395 rushing yards and three touchdowns on 89 carries."),
 p("Florida brings Jadan Baugh, who has 600 rushing yards and 11 touchdowns after his fifth straight 100-yard game, and an offense averaging 53.5 points (second in FBS) and 260 rushing yards (11th), according to the AP. Missouri’s run defense is allowing 100.5 yards a game, 32nd nationally."),
 h("The numbers that matter"),
 p("Penalties could decide it. Florida ranks 134th in FBS at 89.3 penalty yards a game, and Missouri is 117th at 73. Both teams are plus-4 in turnover margin. Florida has held the ball an average of 34:04, seventh in the country."),
 p("Florida opened as a 4.5-point favorite, according to the AP. DraftKings opened the Gators at 5.5 with an over/under of 56.5."),
 h("The history"),
 p("Missouri leads the series 7-6, according to FloridaGators.com, and Florida is 2-4 on the road against the Tigers. The last meeting went to the Tigers, 33-31 at Faurot Field on Nov. 18, 2023."),
 p("“We have not arrived,” Jon Sumrall said after the Ole Miss win. Missouri is where that gets tested: a ranked team, on the road, coming off a lead it expected to hold."),
 {"type":"PARAGRAPH","id":nid(),"nodes":[txt("Editor’s note: More to come this week, including the full GatorBait game preview.",I)],"paragraphData":{}},
]
dp={"title":"Show-Me State of Mind: A First Look at No. 25 Missouri",
 "excerpt":"No. 8 Florida’s reward for routing Ole Miss is a trip to No. 25 Missouri, which let a fourth-quarter lead get away at Mississippi State.",
 "seoSlug":"first-look-missouri-florida-gators-show-me-state-of-mind",
 "memberId":"16433bab-ee11-4e09-9f6c-cac7a12ec042",
 "categoryIds":["a4577921-a2e9-41bb-8a5d-4a9c56f2eb5b"],
 "media":{"wixMedia":{"image":{"id":"d3cfa5_a67ff355ad6a4d668106c2befa41b208~mv2.png","width":1600,"height":900,"altText":"Show-Me State of Mind: No. 8 Florida at No. 25 Missouri, Saturday, Oct. 3, 3:30 p.m. ET. GatorBait Media graphic."}},"displayed":True,"custom":True},
 "richContent":{"nodes":n}}
json.dump({"draftPost":dp,"publish":True},open("draftPost-publish.json","w"),ensure_ascii=False)
w=sum(len(x["nodes"][0]["textData"]["text"].split()) for x in n)
print(w)
