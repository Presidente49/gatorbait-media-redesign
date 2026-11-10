/* GatorBait sport hub TEMPLATE. One engine, one config per sport (CFG) and one data snapshot (SNAP) inlined at build time by tools/sport-hub/build-sport-hub.mjs.
   Mounts as a header module above the News Wire on the sport's Wix blog category route. It only ADDS: the native post list and the News Wire stay in the DOM, untouched.
   Data: ESPN public JSON (schedule, rankings, live header feed) where ESPN covers the sport; FloridaGators.com (roster, schedule) where it does not. Nothing is invented: a missing field is left out.
   First paint is complete (snapshot inlined); live data only updates text in place so the layout does not move. */
(function () {
  'use strict';
  var BUILD = '5ee06d68';
  var CFG = /*CFG*/{"finalHours":40,"minGames":10,"confName":"SEC","chipConf":true,"coachWord":"Head coach","eventWord":"game","eventPlural":"games","oppHead":"Opponent","oppHeadRoster":"Hometown","timeNote":"Times Eastern. A ranked opponent shows its current AP rank.","schoolHead":"High school","ldOrg":"Southeastern Conference","showZeroRecord":false,"liveFiles":[{"file":"hub-data/womens-basketball-uf-stats.json","kind":"bb"}],"key":"womens-basketball","route":"/gatorbait-media-blogs/categories/gator-womens-basketball","title":"Florida Gators women\u2019s basketball","shortName":"women\u2019s basketball","kicker":"Gator women\u2019s basketball hub","nameHtml":"Florida Gators<br>Women\u2019s Basketball","lede":"Live score, schedule and TV, season stats and the full roster for Tammi Reiss\u2019s Florida Gators, with GatorBait\u2019s coverage below.","espn":{"path":"basketball/womens-college-basketball","sport":"basketball","league":"womens-college-basketball","web":"womens-college-basketball"},"anchors":true,"seasonLabel":"2026-27 season","schedHeading":"Florida women\u2019s basketball schedule, results and TV","schedSource":"ESPN. TV listings are ESPN\u2019s current data and can change.","statsHeading":"Florida women\u2019s basketball season stats","rosterHeading":"2026-27 Florida women\u2019s basketball roster","rosterUrl":"https://floridagators.com/sports/womens-basketball/roster","storiesHeading":"Latest Florida women\u2019s basketball coverage","feedCategory":"Gator Women's Basketball","posNames":{"G":"guard","F":"forward","C":"center"},"ldName":"Florida Gators women\u2019s basketball","ldSport":"Basketball","ldDesc":"Florida Gators women\u2019s basketball schedule, TV, season stats, roster and news from GatorBait Media.","seoHeading":"Florida Gators women\u2019s basketball coverage","seoHtml":"<p>GatorBait Media covers Florida women\u2019s basketball: game stories, analysis and the road through the SEC. This page keeps the Florida women\u2019s basketball schedule, TV channels, season stats compiled from final box scores and the full roster in one place, with every women\u2019s basketball story below.</p><h3>Florida women\u2019s basketball schedule and how to watch</h3><p>Each game lists its date, tipoff time in Eastern, TV network and site from ESPN. A game still marked TV TBA will be filled in as networks are chosen.</p><h3>Florida women\u2019s basketball roster</h3><p>The roster is copied from FloridaGators.com with each player\u2019s number, position, class, height, hometown, high school and previous school. For the men\u2019s team, see <a href=\"/gatorbait-media-blogs/categories/gator-basketball\">Gator basketball</a>.</p>"}/*CFG-END*/;
  var SNAP = /*SNAP*/{"rank":{"ap":{"name":"AP Top 25","date":"2026-10-20T07:00Z","fl":null},"co":{"name":"Coaches Poll","date":"2026-10-20T07:00Z","fl":null}},"bb":{"source":"FloridaGators.com","sourceUrl":"https://floridagators.com/sports/womens-basketball/stats","updated":"2026-11-03T04:30:00Z","updatedLabel":"Nov. 3, 2026","ids":["28086"],"games":[{"id":"28086","date":"2026-11-02T23:00Z","opp":"Bucknell","home":"home","fl":83,"op":60,"box":"https://floridagators.com/sports/womens-basketball/stats/2026/bucknell/boxscore/28086"}],"tm":{"pts":83,"fgm":34,"fga":62,"tpm":5,"tpa":19,"ftm":10,"fta":14,"off":11,"def":31,"reb":42,"pf":14,"ast":10,"to":12,"stl":7,"blk":0},"op":{"pts":60,"fgm":22,"fga":59,"tpm":7,"tpa":18,"ftm":9,"fta":13,"off":8,"def":18,"reb":26,"pf":15,"ast":13,"to":9,"stl":8,"blk":1},"pl":{"18393":{"name":"Jade Weathersby","no":"1","gp":1,"gs":0,"min":15,"pts":6,"fgm":2,"fga":3,"tpm":0,"tpa":1,"ftm":2,"fta":2,"off":1,"def":4,"reb":5,"pf":0,"ast":0,"to":0,"stl":0,"blk":0},"18395":{"name":"Mallory Miller","no":"24","gp":1,"gs":0,"min":2,"pts":0,"fgm":0,"fga":0,"tpm":0,"tpa":0,"ftm":0,"fta":0,"off":0,"def":0,"reb":0,"pf":0,"ast":0,"to":0,"stl":0,"blk":0},"18396":{"name":"Vanessa Harris","no":"23","gp":1,"gs":1,"min":33,"pts":26,"fgm":11,"fga":16,"tpm":3,"tpa":5,"ftm":1,"fta":1,"off":0,"def":6,"reb":6,"pf":2,"ast":1,"to":4,"stl":1,"blk":0},"18397":{"name":"Taliyah Parker","no":"21","gp":1,"gs":0,"min":8,"pts":6,"fgm":2,"fga":2,"tpm":2,"tpa":2,"ftm":0,"fta":0,"off":0,"def":2,"reb":2,"pf":1,"ast":0,"to":0,"stl":1,"blk":0},"18398":{"name":"Moriah Murray","no":"3","gp":1,"gs":1,"min":30,"pts":0,"fgm":0,"fga":2,"tpm":0,"tpa":2,"ftm":0,"fta":0,"off":1,"def":2,"reb":3,"pf":3,"ast":1,"to":0,"stl":0,"blk":0},"18399":{"name":"Jordan Jones","no":"4","gp":1,"gs":1,"min":22,"pts":3,"fgm":1,"fga":4,"tpm":0,"tpa":3,"ftm":1,"fta":1,"off":3,"def":3,"reb":6,"pf":0,"ast":1,"to":1,"stl":0,"blk":0},"18400":{"name":"Aurora Alm\u00f3n","no":"0","gp":1,"gs":0,"min":22,"pts":4,"fgm":2,"fga":2,"tpm":0,"tpa":0,"ftm":0,"fta":0,"off":3,"def":7,"reb":10,"pf":3,"ast":1,"to":3,"stl":1,"blk":0},"18401":{"name":"Bailey Harris","no":"11","gp":1,"gs":0,"min":2,"pts":0,"fgm":0,"fga":0,"tpm":0,"tpa":0,"ftm":0,"fta":0,"off":0,"def":0,"reb":0,"pf":1,"ast":0,"to":0,"stl":0,"blk":0},"18402":{"name":"Vivian Iwuchukwu","no":"22","gp":1,"gs":1,"min":19,"pts":7,"fgm":2,"fga":5,"tpm":0,"tpa":0,"ftm":3,"fta":6,"off":1,"def":1,"reb":2,"pf":2,"ast":0,"to":2,"stl":1,"blk":0},"18403":{"name":"Kiyomi McMiller","no":"32","gp":1,"gs":1,"min":36,"pts":31,"fgm":14,"fga":25,"tpm":0,"tpa":4,"ftm":3,"fta":4,"off":2,"def":4,"reb":6,"pf":1,"ast":5,"to":1,"stl":2,"blk":0},"18404":{"name":"Skye Owen","no":"5","gp":1,"gs":0,"min":2,"pts":0,"fgm":0,"fga":1,"tpm":0,"tpa":1,"ftm":0,"fta":0,"off":0,"def":0,"reb":0,"pf":1,"ast":0,"to":0,"stl":0,"blk":0},"18417":{"name":"Ja'Niya Broome","no":"2","gp":1,"gs":0,"min":9,"pts":0,"fgm":0,"fga":2,"tpm":0,"tpa":1,"ftm":0,"fta":0,"off":0,"def":0,"reb":0,"pf":0,"ast":1,"to":1,"stl":1,"blk":0}}},"hasConf":true,"team":{"coach":"Tammi Reiss"},"coaches":[{"name":"Tammi Reiss","title":"Head Women's Basketball Coach"},{"name":"Shay Robinson","title":"Associate Head Coach"},{"name":"Tahnee Balerio","title":"Associate Head Coach"},{"name":"CJ Jones","title":"Associate Head Coach"}],"roster":[{"no":"0","name":"Aurora Alm\u00f3n","pos":"F","cls":"Jr.","ht":"6'4\"","wt":"","home":"Santo Domingo, Domincan Republic","school":"The Webb School","prev":"Miami, Syracuse","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_Almon_Aurora_Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/aurora-almn/18400"},{"no":"1","name":"Jade Weathersby","pos":"F","cls":"Sr.","ht":"6'3\"","wt":"","home":"Aurora, Colo.","school":"Brookwood","prev":"UAB","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_Weathersby_Jade_Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/jade-weathersby/18393"},{"no":"2","name":"Ja'Niya Broome","pos":"G","cls":"So.","ht":"5'10\"","wt":"","home":"Hamilton, Ga.","school":"Harris County High School","prev":"South Georgia Technical College","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_Broome_JaNiya_Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/janiya-broome/18417"},{"no":"3","name":"Moriah Murray","pos":"G","cls":"R-Sr.","ht":"5'9\"","wt":"","home":"Dunmore, Pa.","school":"Dunmore High School","prev":"Drexel/Penn State","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_Murray_Moriah__Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/moriah-murray/18398"},{"no":"4","name":"Jordan Jones","pos":"G","cls":"Sr.","ht":"5'11\"","wt":"","home":"Sylmar, Calif.","school":"Cheyenne East","prev":"Denver/Arizona State","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_Jones_Jordan_Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/jordan-jones/18399"},{"no":"5","name":"Skye Owen","pos":"G","cls":"R-Sr.","ht":"5'8\"","wt":"","home":"Staten Island, N.Y.","school":"St. Francis Prep","prev":"St. Johns","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_Owen_Skye_Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/skye-owen/18404"},{"no":"11","name":"Bailey Harris","pos":"G","cls":"Fr.","ht":"6'0\"","wt":"","home":"Annapolis, Md.","school":"St. Mary's High School","prev":"","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_Harris_Bailey_Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/bailey-harris/18401"},{"no":"21","name":"Taliyah Parker","pos":"G","cls":"Jr.","ht":"6'1\"","wt":"","home":"Oklahoma City, Okla.","school":"South Grand Prairie High School","prev":"Texas A&M/TCU","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_Parker_Taliyah_Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/taliyah-parker/18397"},{"no":"22","name":"Vivian Iwuchukwu","pos":"F","cls":"Jr.","ht":"6'3\"","wt":"","home":"Imo State Nigeria","school":"Montverde Academy","prev":"Southern California","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_Iwuchukwu_Vivian_Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/vivian-iwuchukwu/18402"},{"no":"23","name":"Vanessa Harris","pos":"G","cls":"So.","ht":"5'10\"","wt":"","home":"Glenarden, Md.","school":"Bishop McNamara High School","prev":"Rhode Island","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_Harris_Vanessa_Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/vanessa-harris/18396"},{"no":"24","name":"Mallory Miller","pos":"F","cls":"R-Jr.","ht":"6'4\"","wt":"","home":"Aberdeen, S.D.","school":"Wolsey-Wessington High School","prev":"Arizona State/Butler","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_Miller_Mallory_Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/mallory-miller/18395"},{"no":"32","name":"Kiyomi McMiller","pos":"G","cls":"Jr.","ht":"5'9\"","wt":"","home":"Silver Springs, Md.","school":"Life Center Academy","prev":"Rutgers/Penn State","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_McMiller_Kiyomi_Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/kiyomi-mcmiller/18403"},{"no":"34","name":"Maja Bigovic","pos":"C","cls":"Fr.","ht":"6'5\"","wt":"","home":"Cetinje, Montenegro","school":"","prev":"","img":"https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/gatorzone.com/images/2026/9/25/2026_09_17_WBK_Bigovic_Maja_Headshot_01.jpg","url":"https://floridagators.com/sports/womens-basketball/roster/maja-bigovic/18416"}],"rosterUpdated":"Nov. 3, 2026","fetchedAt":"2026-11-10T22:47:05.250Z","games":[{"id":"401906890","date":"2026-11-02T23:00Z","tbd":false,"opp":{"id":"2083","name":"Bucknell","full":"Bucknell Bison","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/2083.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SECN+"],"note":"","conf":false,"state":"post","score":{"fl":"83","opp":"60","win":true}},{"id":"401906891","date":"2026-11-05T21:30Z","tbd":false,"opp":{"id":"2116","name":"UCF","full":"UCF Knights","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/2116.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SECN+"],"note":"","conf":false,"state":"pre","score":null},{"id":"401906892","date":"2026-11-08T19:00Z","tbd":false,"opp":{"id":"236","name":"Chattanooga","full":"Chattanooga Mocs","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/236.png"},"where":"away","venue":"McKenzie Arena","city":"Chattanooga, TN","tv":["ESPN+"],"note":"","conf":false,"state":"pre","score":null},{"id":"401906893","date":"2026-11-12T23:00Z","tbd":false,"opp":{"id":"58","name":"South Florida","full":"South Florida Bulls","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/58.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SECN+"],"note":"","conf":false,"state":"pre","score":null},{"id":"401906894","date":"2026-11-15T19:00Z","tbd":false,"opp":{"id":"52","name":"Florida St","full":"Florida State Seminoles","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/52.png"},"where":"away","venue":"Tucker Center","city":"Tallahassee, FL","tv":["ACCNX"],"note":"","conf":false,"state":"pre","score":null},{"id":"401906895","date":"2026-11-19T23:00Z","tbd":false,"opp":{"id":"2226","name":"FAU","full":"Florida Atlantic Owls","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/2226.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SECN+"],"note":"","conf":false,"state":"pre","score":null},{"id":"401928216","date":"2026-11-24T20:30Z","tbd":false,"opp":{"id":"277","name":"West Virginia","full":"West Virginia Mountaineers","rank":24,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/277.png"},"where":"neutral","venue":"Imperial Arena","city":"Nassau, Bahamas","tv":["ESPN+"],"note":"Battle 4 Atlantis","conf":false,"state":"pre","score":null},{"id":"401921023","date":"2026-11-26T19:00Z","tbd":false,"opp":{"id":"2166","name":"Davidson","full":"Davidson Wildcats","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/2166.png"},"where":"neutral","venue":"Imperial Arena","city":"Nassau, Bahamas","tv":["ESPNU"],"note":"Battle 4 Atlantis","conf":false,"state":"pre","score":null},{"id":"401906896","date":"2026-12-02T22:00Z","tbd":false,"opp":{"id":"2390","name":"Miami","full":"Miami Hurricanes","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["ESPNU"],"note":"SEC/ACC Women's Challenge","conf":false,"state":"pre","score":null},{"id":"401906897","date":"2026-12-06T19:45Z","tbd":false,"opp":{"id":"2454","name":"North Florida","full":"North Florida Ospreys","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/2454.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SECN+"],"note":"","conf":false,"state":"pre","score":null},{"id":"401906898","date":"2026-12-14T23:00Z","tbd":false,"opp":{"id":"2065","name":"Bethune","full":"Bethune-Cookman Wildcats","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/2065.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SECN+"],"note":"","conf":false,"state":"pre","score":null},{"id":"401906899","date":"2026-12-17T23:00Z","tbd":false,"opp":{"id":"2450","name":"Norfolk St","full":"Norfolk State Spartans","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/2450.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SECN+"],"note":"","conf":false,"state":"pre","score":null},{"id":"401906900","date":"2026-12-20T17:00Z","tbd":false,"opp":{"id":"2127","name":"Charleston So","full":"Charleston Southern Buccaneers","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/2127.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SEC Network"],"note":"","conf":false,"state":"pre","score":null},{"id":"401906901","date":"2026-12-22T18:00Z","tbd":false,"opp":{"id":"50","name":"Florida A&M","full":"Florida A&M Rattlers","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/50.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SECN+"],"note":"","conf":false,"state":"pre","score":null},{"id":"401912827","date":"2026-12-31T20:00Z","tbd":false,"opp":{"id":"96","name":"Kentucky","full":"Kentucky Wildcats","rank":14,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/96.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SECN+"],"note":"","conf":false,"state":"pre","score":null},{"id":"401912833","date":"2027-01-03T19:00Z","tbd":false,"opp":{"id":"8","name":"Arkansas","full":"Arkansas Razorbacks","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/8.png"},"where":"away","venue":"Bud Walton Arena","city":"Fayetteville, AR","tv":["SEC Network"],"note":"","conf":false,"state":"pre","score":null},{"id":"401912840","date":"2027-01-08T00:00Z","tbd":false,"opp":{"id":"333","name":"Alabama","full":"Alabama Crimson Tide","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/333.png"},"where":"away","venue":"Coleman Coliseum","city":"Tuscaloosa, AL","tv":[],"note":"","conf":false,"state":"pre","score":null},{"id":"401912849","date":"2027-01-10T19:00Z","tbd":false,"opp":{"id":"99","name":"LSU","full":"LSU Tigers","rank":9,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/99.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SEC Network"],"note":"We Back Pat","conf":false,"state":"pre","score":null},{"id":"401912857","date":"2027-01-14T23:00Z","tbd":false,"opp":{"id":"2","name":"Auburn","full":"Auburn Tigers","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/2.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":[],"note":"","conf":false,"state":"pre","score":null},{"id":"401912867","date":"2027-01-19T00:00Z","tbd":false,"opp":{"id":"2633","name":"Tennessee","full":"Tennessee Lady Volunteers","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SEC Network"],"note":"","conf":false,"state":"pre","score":null},{"id":"401912875","date":"2027-01-22T00:00Z","tbd":false,"opp":{"id":"2579","name":"South Carolina","full":"South Carolina Gamecocks","rank":1,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/2579.png"},"where":"away","venue":"Colonial Life Arena","city":"Columbia, SC","tv":[],"note":"","conf":false,"state":"pre","score":null},{"id":"401912878","date":"2027-01-24T20:00Z","tbd":false,"opp":{"id":"145","name":"Ole Miss","full":"Ole Miss Rebels","rank":19,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/145.png"},"where":"away","venue":"The Sandy and John Black Pavilion at Ole Miss","city":"Oxford, MS","tv":["SEC Network"],"note":"","conf":false,"state":"pre","score":null},{"id":"401912886","date":"2027-01-28T23:00Z","tbd":false,"opp":{"id":"61","name":"Georgia","full":"Georgia Lady Bulldogs","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/61.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":[],"note":"","conf":false,"state":"pre","score":null},{"id":"401912898","date":"2027-02-05T00:30Z","tbd":false,"opp":{"id":"142","name":"Missouri","full":"Missouri Tigers","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/142.png"},"where":"away","venue":"Mizzou Arena","city":"Columbia, MO","tv":[],"note":"","conf":false,"state":"pre","score":null},{"id":"401912907","date":"2027-02-07T20:00Z","tbd":false,"opp":{"id":"245","name":"Texas A&M","full":"Texas A&M Aggies","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/245.png"},"where":"away","venue":"Reed Arena","city":"College Station, TX","tv":[],"note":"","conf":false,"state":"pre","score":null},{"id":"401912915","date":"2027-02-11T23:00Z","tbd":false,"opp":{"id":"344","name":"Mississippi St","full":"Mississippi State Bulldogs","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/344.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":[],"note":"","conf":false,"state":"pre","score":null},{"id":"401912923","date":"2027-02-14T17:00Z","tbd":false,"opp":{"id":"201","name":"Oklahoma","full":"Oklahoma Sooners","rank":21,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/201.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":["SEC Network"],"note":"","conf":false,"state":"pre","score":null},{"id":"401912933","date":"2027-02-21T20:00Z","tbd":false,"opp":{"id":"251","name":"Texas","full":"Texas Longhorns","rank":6,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/251.png"},"where":"away","venue":"Moody Center","city":"Austin, TX","tv":["SEC Network"],"note":"","conf":false,"state":"pre","score":null},{"id":"401912940","date":"2027-02-26T00:00Z","tbd":false,"opp":{"id":"61","name":"Georgia","full":"Georgia Lady Bulldogs","rank":null,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/61.png"},"where":"away","venue":"Stegeman Coliseum","city":"Athens, GA","tv":["SEC Network"],"note":"","conf":false,"state":"pre","score":null},{"id":"401912948","date":"2027-02-28T18:00Z","tbd":false,"opp":{"id":"238","name":"Vanderbilt","full":"Vanderbilt Commodores","rank":8,"logo":"https://a.espncdn.com/i/teamlogos/ncaa/500/238.png"},"where":"home","venue":"Stephen C. O'Connell Center","city":"Gainesville, FL","tv":[],"note":"","conf":false,"state":"pre","score":null}]}/*SNAP-END*/;
  if (!CFG || !SNAP) return;
  var KEY = CFG.key, P = 'gbm-sh', ROOT = P + '-' + KEY, GLOBAL = '__GBM_SH_' + KEY.toUpperCase().replace(/[^A-Z0-9]/g, '_') + '__';
  if (window[GLOBAL] && window[GLOBAL].build) { window[GLOBAL].sync(); return; }
  var ROUTE = new RegExp('^' + CFG.route.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&') + '\\/?$');
  var ESPN = CFG.espn ? ['https://site.web.api.espn.com/apis/site/v2/sports/' + CFG.espn.path, 'https://site.api.espn.com/apis/site/v2/sports/' + CFG.espn.path] : null;
  var HEADER = CFG.espn ? 'https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=' + CFG.espn.sport + '&league=' + CFG.espn.league : '';
  var LOGO = 'https://a.espncdn.com/i/teamlogos/ncaa/500/';
  var DATA_BASE = 'https://presidente49.github.io/gatorbait-media-redesign/sports-live/';

  /*NORM*/
  function normSchedule(sched, prev) {
    var games = (sched.events || []).map(function (e) {
      var c = e.competitions[0], fl, op, t = c.status.type, sc = function (x) { return x.score && (x.score.displayValue != null ? x.score.displayValue : x.score) || null; };
      c.competitors.forEach(function (x) { if (x.team.id === '57') fl = x; else op = x; });
      if (!fl || !op) return null;
      var r = op.curatedRank && op.curatedRank.current && op.curatedRank.current < 99 ? op.curatedRank.current : null;
      return { id: e.id, date: e.date, tbd: c.timeValid === false, opp: { id: op.team.id, name: op.team.shortDisplayName || op.team.location, full: op.team.displayName, rank: r, logo: LOGO + op.team.id + '.png' },
        where: c.neutralSite ? 'neutral' : fl.homeAway, venue: c.venue ? c.venue.fullName : '', city: c.venue && c.venue.address ? [c.venue.address.city, c.venue.address.state].filter(Boolean).join(', ') : '',
        tv: (c.broadcasts || []).filter(function (b) { return !(b.type && b.type.shortName === 'Radio'); }).map(function (b) { return b.media && b.media.shortName; }).filter(Boolean), note: ((c.notes || [])[0] || {}).headline || '',
        conf: !!c.conferenceCompetition, state: t.state, score: t.state === 'post' ? { fl: sc(fl), opp: sc(op), win: !!fl.winner } : null };
    }).filter(Boolean);
    if (!games.length && prev) return prev;
    return games;
  }
  function normRank(raw, prev) {
    var out = {};
    ['ap', 'co'].forEach(function (k) {
      var want = k === 'ap' ? /^AP Top 25$/ : /Coaches Poll$/, p = ((raw && raw.rankings) || []).filter(function (x) { return want.test(x.name) && !/FCS|Division/.test(x.name); })[0], fl = null;
      if (p) p.ranks.forEach(function (x) { if (x.team.id === '57') fl = { rank: x.current, prev: x.previous, rec: x.recordSummary }; });
      out[k] = p ? { name: p.name, date: p.date, fl: fl } : (prev && prev[k]) || null;
    });
    return out;
  }
  /*NORM-END*/

  /*STATS*/
  function bbNew() { return { ids: [], games: [], tm: {}, op: {}, pl: {} }; }
  function bbNum(x) { var n = parseFloat(x); return isNaN(n) ? 0 : n; }
  function bbMA(v) { var p = String(v || '').split('-'); return [bbNum(p[0]), bbNum(p[1])]; }
  function bbSum(o, k, v) { o[k] = (o[k] || 0) + v; }
  function bbTeamLine(o, stat, pts) {
    var m = {}; (stat || []).forEach(function (x) { m[x.name] = x.displayValue; });
    var fg = bbMA(m['fieldGoalsMade-fieldGoalsAttempted']), tp = bbMA(m['threePointFieldGoalsMade-threePointFieldGoalsAttempted']), ft = bbMA(m['freeThrowsMade-freeThrowsAttempted']);
    bbSum(o, 'pts', pts); bbSum(o, 'fgm', fg[0]); bbSum(o, 'fga', fg[1]); bbSum(o, 'tpm', tp[0]); bbSum(o, 'tpa', tp[1]); bbSum(o, 'ftm', ft[0]); bbSum(o, 'fta', ft[1]);
    bbSum(o, 'reb', bbNum(m.totalRebounds)); bbSum(o, 'ast', bbNum(m.assists)); bbSum(o, 'stl', bbNum(m.steals)); bbSum(o, 'blk', bbNum(m.blocks)); bbSum(o, 'to', bbNum(m.totalTurnovers || m.turnovers)); bbSum(o, 'pf', bbNum(m.fouls));
  }
  /* Adds one FINAL box score (ESPN summary JSON) to acc. Returns false when the game is not final, already counted, or not Florida's. */
  function bbAdd(acc, sum) {
    var comp = sum && sum.header && sum.header.competitions && sum.header.competitions[0], bs = sum && sum.boxscore; if (!comp || !bs) return false;
    var id = String(sum.header.id), t = comp.status && comp.status.type; if (!t || t.state !== 'post' || acc.ids.indexOf(id) > -1) return false;
    var fl = null, op = null; comp.competitors.forEach(function (c) { if (c.team.id === '57') fl = c; else op = c; }); if (!fl || !op) return false;
    var ft = null, ot = null; (bs.teams || []).forEach(function (x) { if (x.team.id === '57') ft = x; else ot = x; }); if (!ft || !ot) return false;
    bbTeamLine(acc.tm, ft.statistics, bbNum(fl.score)); bbTeamLine(acc.op, ot.statistics, bbNum(op.score));
    var pg = null; (bs.players || []).forEach(function (x) { if (x.team.id === '57') pg = x; });
    var st = pg && pg.statistics && pg.statistics[0];
    if (st) {
      var L = st.labels || []; (st.athletes || []).forEach(function (a) {
        if (a.didNotPlay || !a.stats || !a.stats.length) return;
        var g = {}; L.forEach(function (lab, i) { g[lab] = a.stats[i]; });
        var p = acc.pl[a.athlete.id] || (acc.pl[a.athlete.id] = { name: a.athlete.displayName, no: a.athlete.jersey || '', gp: 0 });
        var fg = bbMA(g.FG), tp = bbMA(g['3PT']), ft2 = bbMA(g.FT);
        p.gp += 1; bbSum(p, 'min', bbNum(g.MIN)); bbSum(p, 'pts', bbNum(g.PTS)); bbSum(p, 'fgm', fg[0]); bbSum(p, 'fga', fg[1]); bbSum(p, 'tpm', tp[0]); bbSum(p, 'tpa', tp[1]); bbSum(p, 'ftm', ft2[0]); bbSum(p, 'fta', ft2[1]);
        bbSum(p, 'reb', bbNum(g.REB)); bbSum(p, 'ast', bbNum(g.AST)); bbSum(p, 'stl', bbNum(g.STL)); bbSum(p, 'blk', bbNum(g.BLK)); bbSum(p, 'to', bbNum(g.TO));
      });
    }
    acc.ids.push(id); acc.games.push({ id: id, date: comp.date, opp: op.team.shortDisplayName || op.team.location, home: fl.homeAway, fl: bbNum(fl.score), op: bbNum(op.score) });
    return true;
  }
  /*STATS-END*/

  function anc(id) { return CFG.anchors ? '<span class="s-anc" id="' + id + '"></span>' : ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function safeUrl(u) { return /^https:\/\/(floridagators\.com|www\.espn\.com|www\.gatorbaitmedia\.com|dxbhsrqyrr690\.cloudfront\.net|a\.espncdn\.com)\//.test(u || '') ? u : ''; }
  function onRoute() { return ROUTE.test(location.pathname || ''); }
  var MON = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'], WD = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'], WDL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var ETF = null;
  function et(ts) {
    try {
      ETF = ETF || new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23', weekday: 'short' });
      var p = {}; ETF.formatToParts(new Date(ts)).forEach(function (x) { p[x.type] = x.value; });
      return { y: +p.year, m: +p.month - 1, d: +p.day, h: +p.hour % 24, n: +p.minute, w: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday] };
    } catch (e) { var d = new Date(ts); return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate(), h: d.getHours(), n: d.getMinutes(), w: d.getDay() }; }
  }
  function apTime(p) { if (p.h === 12 && p.n === 0) return 'noon'; var h = p.h % 12 || 12; return h + (p.n ? ':' + (p.n < 10 ? '0' : '') + p.n : '') + ' ' + (p.h < 12 ? 'a.m.' : 'p.m.'); }
  function dayLabel(ts) { var p = et(ts); return WD[p.w] + ' ' + MON[p.m] + ' ' + p.d; }
  function dayLong(ts) { var p = et(ts); return WDL[p.w] + ', ' + MON[p.m] + ' ' + p.d; }
  function iso(ts) { return new Date(ts).toISOString(); }
  function stamp(ts) { if (!ts) return ''; var p = et(ts); return MON[p.m] + ' ' + p.d + ', ' + p.y + ', ' + apTime(p) + ' ET'; }
  /* Games from FloridaGators.com carry a date and a display time but no time zone, so they are normalized to the same shape with a calendar day (noon UTC keeps the ET date) and a text time. */
  function fgGames(list) {
    return list.map(function (g, i) {
      return { id: 'fg' + i, date: g.date + 'T17:00:00Z', tbd: true, timeText: g.time || '', fgDay: g.date, opp: { name: g.opp, rank: null, logo: '' }, event: g.event || '', kind: g.kind || '', where: g.where, venue: g.venue || '', city: g.city || '', tv: g.tv ? [g.tv] : [], note: '', link: g.link || '', sec: !!g.sec, conf: !!g.sec, state: 'pre', score: null };
    });
  }
  function timeLabel(g) { return g.timeText != null && g.fgDay ? (g.timeText || 'Time TBA') : g.tbd ? 'Time TBA' : apTime(et(g.date)) + ' ET'; }
  function dayOf(g) { return g.fgDay ? g.fgDay : (function (p) { return p.y + '-' + (p.m < 9 ? '0' : '') + (p.m + 1) + '-' + (p.d < 10 ? '0' : '') + p.d; })(et(g.date)); }
  function todayKey() { var p = et(Date.now()); return p.y + '-' + (p.m < 9 ? '0' : '') + (p.m + 1) + '-' + (p.d < 10 ? '0' : '') + p.d; }
  function isPast(g) { return g.state === 'post' || (g.fgDay ? dayOf(g) < todayKey() : false); }
  function site(g) { return g.where === 'away' ? 'at' : 'vs.'; }
  function siteWord(g) { return g.where === 'home' ? 'Home' : g.where === 'away' ? 'Away' : 'Neutral'; }
  function tvOf(g) { return g.tv && g.tv.length ? g.tv.join(', ') : 'TV TBA'; }
  function rankName(name, rank) { return (rank ? '<b class="s-rk">No. ' + rank + '</b> ' : '') + esc(name); }

  var D = null, LIVE = null, STORIES = [], DONE = false, HUB = null, RPOS = 'All', RQ = '';

  function recordOf(games, confOnly) {
    var w = 0, l = 0;
    games.forEach(function (g) { if (g.state === 'post' && g.score && (!confOnly || g.conf)) { if (g.score.win) w++; else l++; } });
    return w + '-' + l;
  }
  function nextGame(d) {
    for (var i = 0; i < d.games.length; i++) if (!isPast(d.games[i])) return d.games[i];
    return null;
  }
  function countdown(g) {
    if (g.fgDay) { var days = Math.round((Date.parse(g.fgDay + 'T12:00:00Z') - Date.parse(todayKey() + 'T12:00:00Z')) / 864e5); return days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : days > 1 ? 'In ' + days + ' days' : ''; }
    var ms = new Date(g.date).getTime() - Date.now();
    if (g.tbd || ms < 0) return '';
    var h = ms / 36e5; if (h < 1) return 'Starts in ' + Math.max(1, Math.round(ms / 6e4)) + ' min';
    if (h < 24) return 'Starts in ' + Math.round(h) + ' hr';
    return 'In ' + Math.round(h / 24) + ' days';
  }
  function gamecast(id) { return 'https://www.espn.com/' + CFG.espn.web + '/game?gameId=' + encodeURIComponent(id); }
  function liveFor(d, live) { var g = null; d.games.forEach(function (x) { if (x.id === live.id) g = x; }); return g; }

  /* ---------- hero ---------- */
  function heroCard(d) {
    var ng = nextGame(d), live = LIVE, h = '';
    if (live && live.state === 'in') {
      var lg = liveFor(d, live);
      return '<span class="s-pill live" role="status"><i></i>Live now</span><div class="s-score"><span>' + rankName('Florida', live.flRank) + '</span><span>' + esc(live.fl) + '</span><span>' + rankName(live.oppName, live.oppRank) + '</span><span>' + esc(live.opp) + '</span></div>' +
        '<p class="s-meta"><b>' + esc(live.summary) + '</b> on ' + esc(lg ? tvOf(lg) : 'ESPN') + '</p><a class="s-btn" href="' + gamecast(live.id) + '">Follow on ESPN</a>';
    }
    var last = null; d.games.forEach(function (g) { if (g.state === 'post' && g.score) last = g; });
    if (live && live.state === 'post' && !(last && last.id === live.id)) last = { id: live.id, score: { fl: live.fl, opp: live.opp, win: +live.fl > +live.opp }, opp: { name: live.oppName, rank: live.oppRank }, date: live.date };
    if (last && new Date(last.date).getTime() > Date.now() - CFG.finalHours * 36e5) {
      h = '<span class="s-pill"><i></i>Final</span><div class="s-score"><span>Florida</span><span>' + esc(last.score.fl) + '</span><span>' + rankName(last.opp.name, last.opp.rank) + '</span><span>' + esc(last.score.opp) + '</span></div>' +
        '<p class="s-meta"><b>' + (last.score.win ? 'Gators win' : 'Gators fall') + '</b>' + (CFG.espn && last.id ? ' &middot; <a href="' + gamecast(last.id) + '">Box score on ESPN</a>' : '') + '</p>';
      if (ng) h += '<p class="s-then"><b>Next:</b> ' + site(ng) + ' ' + rankName(ng.opp.name, ng.opp.rank) + ', ' + esc(dayLong(ng.date)) + ', ' + esc(timeLabel(ng)) + ', ' + esc(tvOf(ng)) + '.</p>';
      return h;
    }
    if (!ng) return '<span class="s-pill"><i></i>Season complete</span><h3 class="s-vs">Thanks for following the Gators</h3><p class="s-meta">The ' + esc(CFG.seasonLabel) + ' schedule is complete. The next season\u2019s dates post on FloridaGators.com.</p>';
    var cd = countdown(ng), nm = ng.event ? esc(ng.event) : ng.kind ? esc(ng.opp.name) : site(ng) + ' ' + rankName(ng.opp.name, ng.opp.rank);
    if (ng.event) nm += '<small>' + site(ng) + ' ' + esc(ng.opp.name) + '</small>';
    return '<span class="s-pill' + (ng.state === 'in' ? ' live' : '') + '"><i></i>' + (ng.state === 'in' ? 'Live now' : 'Next ' + esc(CFG.eventWord)) + '</span>' +
      '<h3 class="s-vs">' + nm + '</h3>' +
      '<p class="s-meta"><b>' + esc(ng.fgDay ? dayLong(ng.date) : dayLong(ng.date)) + ', ' + esc(timeLabel(ng)) + '</b>' + (cd ? ' (' + esc(cd) + ')' : '') + '</p>' +
      '<p class="s-meta">TV: <b>' + esc(tvOf(ng)) + '</b></p><p class="s-meta">' + esc([ng.venue, ng.city].filter(Boolean).join(', ')) + (ng.note ? ' &middot; ' + esc(ng.note) : '') + '</p>' +
      '<a class="s-btn" href="#' + ROOT + '-sched">Full schedule</a>';
  }
  function badges(d) {
    var b = '', rec = recordOf(d.games), conf = d.hasConf ? recordOf(d.games, true) : '';
    if (d.rank && d.rank.ap && d.rank.ap.fl) b += '<li class="hot">No. ' + d.rank.ap.fl.rank + ' AP</li>';
    if (d.rank && d.rank.co && d.rank.co.fl) b += '<li>No. ' + d.rank.co.fl.rank + ' Coaches</li>';
    if (d.games.some(function (g) { return g.state === 'post'; }) || CFG.showZeroRecord) b += '<li>' + esc(rec) + ' overall</li>';
    if (conf && d.games.some(function (g) { return g.conf && g.state === 'post'; })) b += '<li>' + esc(conf) + ' ' + esc(CFG.confName) + '</li>';
    if (d.team && d.team.coach) b += '<li class="soft">' + esc(CFG.coachWord) + ' ' + esc(d.team.coach) + '</li>';
    return b;
  }
  function hero(d) {
    var nav = '<a href="#' + ROOT + '-stories">Stories</a><a href="#' + ROOT + '-sched">Schedule</a>' + ((d.stats || d.bb) ? '<a href="#' + ROOT + '-stats">Stats</a>' : '') + '<a href="#' + ROOT + '-roster">Roster</a>';
    return '<div class="s-top"><div class="s-wrap"><div><div class="s-kick">GatorBait Media &middot; ' + esc(CFG.kicker) + '</div><h2 class="s-name">' + CFG.nameHtml + '</h2><ul class="s-badges">' + badges(d) + '</ul><p class="s-lede">' + esc(CFG.lede) + '</p>' +
      '<nav class="s-nav" aria-label="' + esc(CFG.title) + ' sections">' + nav + '</nav></div><div class="s-card" id="' + ROOT + '-card" aria-live="polite">' + heroCard(d) + '</div></div></div>';
  }

  /* ---------- schedule ---------- */
  function schedule(d) {
    var ng = nextGame(d), rows = d.games.map(function (g) {
      var past = isPast(g), cls = (g === ng ? 'nx ' : '') + (g.opp.rank ? 'rk ' : '') + (past ? 'pt' : '');
      var res = g.state === 'post' && g.score ? '<span class="res ' + (g.score.win ? 'w' : 'l') + '">' + (g.score.win ? 'W' : 'L') + ' ' + esc(g.score.fl) + '-' + esc(g.score.opp) + '</span>' : g.state === 'in' ? '<b class="s-rk">Live</b>' : past ? 'Played' : esc(timeLabel(g));
      var name = g.event ? esc(g.event) + '<small class="ev">' + site(g) + ' ' + esc(g.opp.name) + '</small>' : site(g) + ' ' + rankName(g.opp.name, g.opp.rank) + (g.conf && CFG.chipConf ? '<span class="chip">' + esc(CFG.confName) + '</span>' : '');
      if (g.link && !g.event && /Preview/.test(g.opp.name)) name = '<a href="' + esc(safeUrl(g.link)) + '">' + esc(g.opp.name) + '</a>';
      else if (g.kind && !g.event) name = esc(g.opp.name);
      return '<tr class="' + cls + '"><td class="d"><time datetime="' + (g.fgDay || iso(g.date)) + '">' + esc(g.fgDay ? dayLabel(g.date) : dayLabel(g.date)) + '</time></td>' +
        '<td class="o"><span class="g-o">' + (g.opp.logo ? '<img loading="lazy" decoding="async" width="26" height="26" alt="" src="' + esc(g.opp.logo) + '">' : '<span class="lg"></span>') + '<span><span>' + name + '</span><small>' + esc(siteWord(g)) + '<span class="vn">' + esc((g.venue ? ' \u00b7 ' + g.venue : '') + (g.city ? ', ' + g.city : '')) + '</span>' + (g.note ? '<span class="nt">' + esc(' \u00b7 ' + g.note) + '</span>' : '') + '</small></span></span></td>' +
        '<td class="t">' + res + '</td><td class="v">' + esc(tvOf(g)) + '</td></tr>';
    }).join('');
    var nconf = d.games.filter(function (g) { return g.conf; }).length;
    return '<section class="s-sec" id="' + ROOT + '-sched" aria-labelledby="' + ROOT + '-h-sched">' + anc('schedule') + '<h2 class="s-h" id="' + ROOT + '-h-sched">' + esc(CFG.schedHeading) + '</h2><p class="s-sub">' + d.games.length + ' ' + esc(CFG.eventPlural) + (nconf ? ', ' + nconf + ' in ' + esc(CFG.confName) + ' play' : '') + '. ' + esc(CFG.timeNote) + '</p>' +
      '<table class="sch"><caption>' + esc(CFG.title) + ' schedule</caption><thead><tr><th>Date</th><th>' + esc(CFG.oppHead) + '</th><th>Time / result</th><th>TV</th></tr></thead><tbody>' + rows + '</tbody></table><p class="s-src">Source: ' + esc(CFG.schedSource) + (d.fetchedAt && CFG.espn ? ' Updated ' + esc(stamp(d.fetchedAt)) + '.' : '') + '</p></section>';
  }

  /* ---------- season stats (sports whose snapshot carries them) ---------- */

  function bbPct(m, a) { return a ? (m / a * 100).toFixed(1) + '%' : '\u2013'; }
  function bbAvg(v, g) { return g ? (v / g).toFixed(1) : '\u2013'; }
  function bbStatsSec(d) {
    var b = d.bb; if (!b || !b.games.length) return '';
    var g = b.games.length, T = b.tm, O = b.op, last = b.games.slice().sort(function (x, y) { return Date.parse(x.date) - Date.parse(y.date); }).pop(), p = et(last.date);
    var w = b.games.filter(function (x) { return x.fl > x.op; }).length;
    var tiles = [[w + '-' + (g - w), 'Record, games counted', ''], [bbAvg(T.pts, g), 'Points per game', bbAvg(O.pts, g) + ' allowed'], [bbPct(T.fgm, T.fga), 'Field goal %', bbPct(O.fgm, O.fga) + ' opp.'], [bbAvg(T.reb, g), 'Rebounds per game', bbAvg(O.reb, g) + ' opp.']];
    var fin = (d.games || []).filter(function (x) { return x.state === 'post'; }).length, stale = b.source && fin > g ? '<p class="s-sub">ESPN lists ' + (fin - g) + ' newer final ' + (fin - g === 1 ? 'game' : 'games') + '. They join these averages when FloridaGators.com posts the box score.</p>' : '';
    var tl = tiles.map(function (t) { return '<li><b>' + esc(t[0]) + '</b><span>' + esc(t[1]) + '</span><small>' + esc(t[2]) + '</small></li>'; }).join('');
    var rows = [['Points per game', bbAvg(T.pts, g), bbAvg(O.pts, g)], ['Field goal %', bbPct(T.fgm, T.fga), bbPct(O.fgm, O.fga)], ['3-point %', bbPct(T.tpm, T.tpa), bbPct(O.tpm, O.tpa)], ['Free throw %', bbPct(T.ftm, T.fta), bbPct(O.ftm, O.fta)], ['Rebounds per game', bbAvg(T.reb, g), bbAvg(O.reb, g)], ['Assists per game', bbAvg(T.ast, g), bbAvg(O.ast, g)], ['Steals per game', bbAvg(T.stl, g), bbAvg(O.stl, g)], ['Blocks per game', bbAvg(T.blk, g), bbAvg(O.blk, g)], ['Turnovers per game', bbAvg(T.to, g), bbAvg(O.to, g)]];
    var trs = rows.map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('');
    var pl = Object.keys(b.pl).map(function (k) { return b.pl[k]; }).sort(function (x, y) { return y.pts / y.gp - x.pts / x.gp || y.min - x.min; });
    var hasGs = pl.some(function (x) { return x.gs != null; });
    var prs = pl.map(function (x) { return '<tr><th scope="row">' + esc(x.name) + '</th><td class="n">' + x.gp + '</td>' + (hasGs ? '<td class="n">' + (x.gs || 0) + '</td>' : '') + '<td class="n">' + bbAvg(x.min, x.gp) + '</td><td class="n">' + bbAvg(x.pts, x.gp) + '</td><td class="n">' + bbAvg(x.reb, x.gp) + '</td><td class="n">' + bbAvg(x.ast, x.gp) + '</td><td class="n">' + bbAvg(x.stl, x.gp) + '</td><td class="n">' + bbAvg(x.blk, x.gp) + '</td><td class="n">' + bbPct(x.fgm, x.fga) + '</td><td class="n">' + bbPct(x.tpm, x.tpa) + '</td><td class="n">' + bbPct(x.ftm, x.fta) + '</td></tr>'; }).join('');
    return '<section class="s-sec" id="' + ROOT + '-stats" aria-labelledby="' + ROOT + '-h-stats">' + anc('stats') + '<h2 class="s-h" id="' + ROOT + '-h-stats">' + esc(CFG.statsHeading) + '</h2><p class="s-sub">' + g + (g === 1 ? ' game' : ' games') + ' counted, through ' + esc(MON[p.m] + ' ' + p.d) + ' ' + esc(last.home === 'away' ? 'at' : 'vs.') + ' ' + esc(last.opp) + '. ' + (b.source ? 'Statistics: <a href="' + esc(b.sourceUrl) + '">' + esc(b.source) + '</a>, updated ' + esc(b.updatedLabel || '') + '.' : 'Final box scores from ESPN only; averages update as each game ends.') + '</p>' + stale +
      '<ul class="s-tiles">' + tl + '</ul><div class="s-statgrid"><div class="s-lt"><h3>Team, Florida vs. opponents</h3><table class="s-tm"><thead><tr><th>Per game</th><th class="n">Florida</th><th class="n">Opp.</th></tr></thead><tbody>' + trs + '</tbody></table></div>' +
      '<div class="s-lt s-pl"><h3>Players, per game</h3><div class="s-scroll"><table><thead><tr><th>Player</th><th class="n">GP</th>' + (hasGs ? '<th class="n">GS</th>' : '') + '<th class="n">MIN</th><th class="n">PTS</th><th class="n">REB</th><th class="n">AST</th><th class="n">STL</th><th class="n">BLK</th><th class="n">FG%</th><th class="n">3P%</th><th class="n">FT%</th></tr></thead><tbody>' + prs + '</tbody></table></div></div></div>' +
      '<p class="s-src">' + (b.source ? 'Statistics: <a href="' + esc(b.sourceUrl) + '">FloridaGators.com</a>. Averages and percentages are computed from the official totals. Box scores: ' + b.games.filter(function (x) { return x.box; }).map(function (x) { return '<a href="' + esc(x.box) + '">' + esc(x.opp) + '</a>'; }).join(', ') + '.' : 'Source: <a href="https://www.espn.com/womens-college-basketball/team/stats/_/id/57/florida-gators">ESPN box scores</a>, compiled by GatorBait Media from final games. Percentages are totals made over attempted.') + '</p></section>';
  }
  function statsSec(d) {
    if (d.bb) return bbStatsSec(d);
    var s = d.stats; if (!s) return '';
    var tiles = (s.tiles || []).map(function (t) { return '<li><b>' + esc(t[1]) + '</b><span>' + esc(t[0]) + '</span><small>' + esc(t[2] || '') + '</small></li>'; }).join('');
    var trs = (s.teamRows || []).map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('');
    var L = s.lead || {}, tbl = function (title, head, rows, n) {
      if (!rows || !rows.length) return '';
      return '<div class="s-lt"><h3>' + esc(title) + '</h3><table><thead><tr>' + head.map(function (x, i) { return '<th' + (i ? ' class="n"' : '') + '>' + esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.slice(0, n || 5).map(function (r) { return '<tr>' + r.map(function (x, i) { return i ? '<td class="n">' + esc(x) + '</td>' : '<th scope="row">' + esc(x) + '</th>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    };
    return '<section class="s-sec" id="' + ROOT + '-stats" aria-labelledby="' + ROOT + '-h-stats">' + anc('stats') + '<h2 class="s-h" id="' + ROOT + '-h-stats">' + esc(CFG.statsHeading) + '</h2><p class="s-sub">Through ' + esc(s.through) + '. Updated ' + esc(s.updatedLabel) + '. ' + (s.source ? 'Official statistics from FloridaGators.com.' : 'Final box scores only.') + '</p>' +
      '<ul class="s-tiles">' + tiles + '</ul><div class="s-statgrid"><div class="s-lt"><h3>Team, Florida vs. opponents</h3><table class="s-tm"><thead><tr><th>Stat</th><th class="n">Florida</th><th class="n">Opp.</th></tr></thead><tbody>' + trs + '</tbody></table></div>' +
      '<div class="s-leaders">' + tbl('Passing', ['Player', 'C-A', 'Yds', 'TD', 'INT'], L.pass, 3) + tbl('Rushing', ['Player', 'Att', 'Yds', 'Avg', 'TD', 'Lng'], L.rush, 5) + tbl('Receiving', ['Player', 'Rec', 'Yds', 'Avg', 'TD', 'Lng'], L.rec, 5) + tbl('Defense', ['Player', 'Tkl', 'TFL', 'Sk', 'INT', 'PBU'], L.def, 5) + '</div></div>' +
      '<p class="s-src">' + (s.source ? 'Statistics' : 'Sources') + ': ' + (s.src || []).map(function (x) { return '<a href="' + esc(safeUrl(x[1])) + '">' + esc(x[0]) + '</a>'; }).join(', ') + '.</p></section>';
  }

  /* ---------- roster (FloridaGators.com layout) ---------- */
  function statusOf(d, name) { var st = d.status && d.status[name]; return st && st.label ? st : null; }
  function posList(d) { var seen = {}, out = []; (d.roster || []).forEach(function (p) { if (p.pos && !seen[p.pos]) { seen[p.pos] = 1; out.push(p.pos); } }); return out; }
  function rosterRows(d) {
    var q = RQ.toLowerCase();
    return (d.roster || []).map(function (p, i) {
      var hide = (RPOS !== 'All' && p.pos !== RPOS) || (q && (p.name + ' ' + p.home + ' ' + p.school + ' ' + p.prev).toLowerCase().indexOf(q) < 0), st = statusOf(d, p.name), u = safeUrl(p.url), im = safeUrl(p.img);
      var nm = u ? '<a href="' + esc(u) + '">' + esc(p.name) + '</a>' : esc(p.name);
      return '<tr' + (hide ? ' hidden' : '') + '><td class="ph">' + (im ? '<img loading="lazy" decoding="async" width="56" height="56" alt="' + esc(p.name + ', Florida ' + ((CFG.posNames && CFG.posNames[p.pos]) || p.pos)) + '" src="' + esc(im) + '">' : '<span class="p-ni"></span>') + '</td>' +
        '<td class="no">' + esc(p.no) + '</td><td class="nm">' + nm + (st ? '<a class="stt ' + esc(st.status) + '" href="/roster" title="' + esc(st.note || '') + '">' + esc(st.label) + '</a>' : '') + '<small class="m">' + esc([p.pos, p.cls, p.ht, p.wt ? p.wt + ' lbs' : ''].filter(Boolean).join(' \u00b7 ')) + '</small></td>' +
        '<td class="ps">' + esc(p.pos) + '</td><td class="cl">' + esc(p.cls) + '</td><td class="ht">' + esc(p.ht) + '</td><td class="wt">' + esc(p.wt) + '</td>' +
        '<td class="hm">' + esc(p.home) + (p.school ? '<small>' + esc(p.school) + '</small>' : '') + '</td><td class="pv">' + esc(p.prev) + '</td></tr>';
    }).join('');
  }
  function rosterSec(d) {
    if (!d.roster || !d.roster.length) return '';
    var chips = posList(d).length < 2 ? '' : ['All'].concat(posList(d)).map(function (x) { return '<button type="button" data-pos="' + esc(x) + '" aria-pressed="' + (x === RPOS) + '">' + esc(x) + '</button>'; }).join('');
    var coaches = (d.coaches || []).length ? '<p class="s-sub">' + (d.coaches || []).slice(0, 4).map(function (c) { return esc(c.title) + ' <b>' + esc(c.name) + '</b>'; }).join(' &middot; ') + '.</p>' : '';
    return '<section class="s-sec" id="' + ROOT + '-roster" aria-labelledby="' + ROOT + '-h-roster">' + anc('roster') + '<h2 class="s-h" id="' + ROOT + '-h-roster">' + esc(CFG.rosterHeading) + '</h2>' + coaches + '<p class="s-sub">' + d.roster.length + ' players, copied from <a href="' + esc(CFG.rosterUrl) + '">the official roster on FloridaGators.com</a>' + (d.rosterUpdated ? ', pulled ' + esc(d.rosterUpdated) : '') + '.' + (CFG.rosterLink ? ' For injury and availability detail see the <a href="' + esc(CFG.rosterLink) + '">Gators roster page</a>.' : '') + '</p>' +
      '<div class="s-filter"><div class="s-chips" role="group" aria-label="Filter roster by position">' + chips + '</div><label class="s-find"><span>Find a player</span><input type="search" id="' + ROOT + '-q" placeholder="Name, hometown or school" value="' + esc(RQ) + '" autocomplete="off"></label></div>' +
      '<div class="s-clip' + (d.roster.length > (CFG.rosterClip || 999) ? ' on' : '') + '" id="' + ROOT + '-clip"><table class="ros' + (d.roster.some(function (p) { return p.wt; }) ? '' : ' nowt') + '"><caption>' + esc(CFG.title) + ' roster</caption><thead><tr><th class="ph"><span class="vh">Photo</span></th><th class="no">No.</th><th>Name</th><th class="ps">Pos.</th><th class="cl">Class</th><th class="ht">Ht.</th><th class="wt">Wt.</th><th class="hm">Hometown / ' + esc(CFG.schoolHead) + '</th><th class="pv">Previous school</th></tr></thead><tbody id="' + ROOT + '-rb">' + rosterRows(d) + '</tbody></table></div>' + (d.roster.length > (CFG.rosterClip || 999) ? '<button type="button" class="s-more" data-more="1" aria-expanded="false" aria-controls="' + ROOT + '-clip">Show all ' + d.roster.length + ' players</button>' : '') +
      '<p class="s-src s-credit">Headshots and roster data: <a href="' + esc(CFG.rosterUrl) + '">FloridaGators.com</a>. Photos courtesy UAA (University Athletic Association) and the photographers credited there; images load from FloridaGators.com and are not re-hosted. See the official <a href="https://floridagators.com/galleries">Florida Gators photo galleries</a>.</p></section>';
  }
  function availSec(d) {
    if (!d.status) return '';
    var names = Object.keys(d.status).filter(function (n) { return d.status[n].label; });
    var A = d.availability || {};
    if (!names.length && !A.label) return '';
    var items = names.map(function (n) { var m = d.status[n]; return '<li><b>' + esc(n) + '</b> <span class="stt ' + esc(m.status) + '">' + esc(m.label) + '</span>' + (m.note ? ' ' + esc(m.note) : '') + (m.src && safeUrl(m.src) ? ' <a href="' + esc(m.src) + '">Source</a>' : '') + '</li>'; }).join('');
    return '<section class="s-sec" id="' + ROOT + '-avail" aria-labelledby="' + ROOT + '-h-avail"><h2 class="s-h" id="' + ROOT + '-h-avail">Injury and availability</h2><p class="s-sub">' + esc(A.label || '') + (A.asOf ? ' <b>As of ' + esc(A.asOf) + '.</b>' : '') + ' <a href="/roster">Full roster page with the live status list</a>.</p>' + (items ? '<ul class="s-ail">' + items + '</ul>' : '') + '</section>';
  }

  /* ---------- stories ---------- */
  function storyCards() {
    if (DONE && !STORIES.length) return '<p class="s-sub">New ' + esc(CFG.shortName) + ' stories post here as they publish.</p>';
    var out = '';
    for (var i = 0; i < 6; i++) {
      var s = STORIES[i];
      if (!s) { out += '<li class="s-st s-ph" aria-hidden="true"><span class="im"></span><h3>&nbsp;</h3><div class="m">&nbsp;</div></li>'; continue; }
      out += '<li class="s-st">' + (s.img ? '<a class="im" href="' + esc(s.url) + '" tabindex="-1" aria-hidden="true"><img loading="lazy" decoding="async" width="400" height="225" alt="" src="' + esc(s.img) + '"></a>' : '<span class="im"></span>') + '<h3><a href="' + esc(s.url) + '">' + esc(s.title) + '</a></h3><div class="m">' + esc([s.by ? 'By ' + s.by : '', s.when || ''].filter(Boolean).join(' \u00b7 ')) + '</div></li>';
    }
    return '<ul class="s-cards">' + out + '</ul>';
  }
  function storiesSec() {
    return '<section class="s-sec" id="' + ROOT + '-stories" aria-labelledby="' + ROOT + '-h-st">' + anc('stories') + '<h2 class="s-h" id="' + ROOT + '-h-st">' + esc(CFG.storiesHeading) + '</h2><p class="s-sub">Independent reporting and analysis from GatorBait Media. <a href="#gbm-np">Every ' + esc(CFG.shortName) + ' story is listed below</a>.</p><div id="' + ROOT + '-cards">' + storyCards() + '</div></section>';
  }
  function seoSec(d) {
    return '<div class="s-seo"><h2>' + esc(CFG.seoHeading) + '</h2>' + CFG.seoHtml + '</div>';
  }
  function ld(d) {
    var o = { '@context': 'https://schema.org', '@type': 'SportsTeam', name: CFG.ldName, sport: CFG.ldSport, url: 'https://www.gatorbaitmedia.com' + CFG.route, memberOf: { '@type': 'SportsOrganization', name: CFG.ldOrg }, parentOrganization: { '@type': 'CollegeOrUniversity', name: 'University of Florida' },
      description: CFG.ldDesc };
    if (d.team && d.team.coach) o.coach = { '@type': 'Person', name: d.team.coach };
    if (d.roster && d.roster.length) o.athlete = d.roster.map(function (p) { var a = { '@type': 'Person', name: p.name }; if (safeUrl(p.url)) a.url = p.url; return a; });
    var ev = { '@context': 'https://schema.org', '@type': 'ItemList', name: CFG.title + ' schedule', itemListElement: d.games.filter(function (g) { return !g.fgDay; }).slice(0, 40).map(function (g, i) {
      var e = { '@type': 'SportsEvent', name: 'Florida ' + (g.where === 'away' ? 'at ' : 'vs. ') + g.opp.name, startDate: g.date }; if (g.venue) e.location = { '@type': 'Place', name: g.venue + (g.city ? ', ' + g.city : '') };
      return { '@type': 'ListItem', position: i + 1, item: e };
    }) };
    if (!ev.itemListElement.length) ev = null;
    return [o, ev].filter(Boolean).map(function (x) { return JSON.stringify(x).replace(/</g, '\\u003c'); });
  }
  function ldStories() {
    if (!STORIES.length) return '';
    return JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Latest ' + CFG.title + ' stories from GatorBait Media', itemListElement: STORIES.slice(0, 6).map(function (s, i) { return { '@type': 'ListItem', position: i + 1, url: 'https://www.gatorbaitmedia.com' + s.url, name: s.title }; }) }).replace(/</g, '\\u003c');
  }

  var CSS = '' +
    '#R{--navy:#10264b;--or:#fa4616;--or-ink:#b93a0e;--line:#e3e7ee;--soft:#f6f7fa;--mute:#4b5a73;position:relative;z-index:3;display:block;width:var(--sh-vw,100vw);max-width:100vw;margin:0 0 8px calc(50% - var(--sh-vw,100vw)/2);background:#fff;color:var(--navy);font:400 16px/1.5 Barlow,Arial,sans-serif;text-align:left;text-transform:none;letter-spacing:0;overflow-anchor:none}' +
    '#R *{box-sizing:border-box}#R a{color:var(--navy)}#R a:focus-visible,#R button:focus-visible,#R input:focus-visible{outline:3px solid var(--navy);outline-offset:2px}#R .vh{position:absolute;left:-9999px}#R .s-anc{display:block;height:0;scroll-margin-top:92px}' +
    '#R .s-wrap{max-width:1240px;margin:0 auto;padding:0 20px}' +
    '#R .s-top{background:#f3f5f9;border-top:3px solid var(--or);padding:28px 0 26px}#R .s-top .s-wrap{display:grid;grid-template-columns:1.15fr 1fr;gap:28px;align-items:stretch}' +
    '#R .s-kick{font:700 13px/1.3 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--mute)}' +
    '#R .s-name{margin:6px 0 10px;font:800 clamp(40px,7.2vw,70px)/.92 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;color:var(--navy)}' +
    '#R .s-badges{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px;padding:0;list-style:none}#R .s-badges li{flex:0 0 auto;width:auto;padding:4px 11px;border:1px solid var(--navy);background:#fff;font:800 16px/1.2 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase}#R .s-badges li.hot{border-width:2px;box-shadow:inset 0 -3px 0 var(--or)}#R .s-badges li.soft{border-color:var(--line);font-weight:700;color:var(--mute)}' +
    '#R .s-lede{margin:0 0 16px;font:500 18px/1.5 Barlow,sans-serif;color:#33425e;max-width:36em}' +
    '#R .s-nav{display:flex;flex-wrap:wrap;gap:8px}#R .s-nav a{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;font:800 16px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;color:var(--navy);background:#fff;border:2px solid var(--navy)}#R .s-nav a:hover{box-shadow:inset 0 -3px 0 var(--or)}' +
    '#R .s-card{background:#fff;color:var(--navy);padding:18px 22px 20px;border:1px solid var(--line);border-top:3px solid var(--or);display:flex;flex-direction:column;justify-content:center;min-height:262px}' +
    '#R .s-pill{display:inline-flex;align-items:center;gap:8px;font:800 14px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--navy)}#R .s-pill i{width:10px;height:10px;border-radius:50%;background:#9aa5b8}#R .s-pill.live i{background:var(--or);box-shadow:0 0 0 4px #fa461630}' +
    '#R .s-vs{margin:6px 0 4px;font:800 clamp(26px,3.4vw,36px)/1.05 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase}#R .s-vs small{display:block;margin-top:2px;font:600 17px "Barlow",sans-serif;color:var(--mute);text-transform:none}' +
    '#R .s-score{display:grid;grid-template-columns:1fr auto;gap:4px 16px;margin:8px 0 4px;font:800 clamp(26px,4vw,36px)/1.1 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase}#R .s-score span:nth-child(even){text-align:right}' +
    '#R .s-meta{margin:2px 0 0;color:var(--mute);font-size:16px}#R .s-meta b{color:var(--navy)}#R .s-then{margin:12px 0 0;padding-top:10px;border-top:1px solid var(--line);font-size:15px;color:var(--mute)}' +
    '#R .s-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;margin-top:12px;padding:0 20px;background:#fff;border:2px solid var(--navy);box-shadow:inset 0 -3px 0 var(--or);color:var(--navy)!important;font:800 16px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;align-self:flex-start}' +
    '#R section.s-sec{padding:30px 0 4px;scroll-margin-top:90px}#R h2.s-h{margin:0 0 6px;font:800 clamp(28px,4vw,38px)/1 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;border-left:3px solid var(--or);padding-left:12px}' +
    '#R .s-sub{margin:0 0 14px;color:var(--mute);font-size:15px}#R .s-src{margin:10px 0 0;font-size:13px;color:var(--mute)}' +
    '#R table{width:100%;border-collapse:collapse;font-size:16px}#R caption{position:absolute;left:-9999px}' +
    '#R th{text-align:left;padding:8px 10px;font:800 13px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);border-bottom:2px solid var(--navy);white-space:nowrap}' +
    '#R td{padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:middle}#R .sch td.d{width:118px;white-space:nowrap}#R .sch td.t{width:112px;white-space:nowrap}#R .sch td.v{width:150px}' +
    '#R tr.nx td{background:#f3f5f9}#R tr.nx td:first-child,#R tr.rk td:first-child{box-shadow:inset 3px 0 0 var(--or)}#R tr.pt{color:#4b5a73}#R .s-rk{color:var(--or-ink);font-weight:800}' +
    '#R .g-o{display:flex;align-items:center;gap:10px;font-weight:700}#R .g-o img,#R .g-o .lg{width:26px;height:26px;object-fit:contain;flex:none}#R .g-o .lg{display:block}#R .g-o small{display:block;font-weight:400;color:var(--mute);font-size:14px}#R .g-o small.ev,#R .ev{display:block;font-weight:400}' +
    '#R .chip{display:inline-block;margin-left:6px;padding:0 6px;border:1px solid var(--navy);font:800 12px/18px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.1em;text-transform:uppercase;vertical-align:2px}' +
    '#R .res.w{color:#116a3a;font-weight:800}#R .res.l{color:#9b1c1c;font-weight:800}' +
    '#R .s-tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:0 0 18px;padding:0;list-style:none}#R .s-tiles li{border:1px solid var(--line);border-top:3px solid var(--or);padding:10px 12px;background:#fff}#R .s-tiles b{display:block;font:800 clamp(28px,3.6vw,38px)/1 "Barlow Condensed",Barlow,sans-serif}#R .s-tiles span{display:block;font:700 13px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}#R .s-tiles small{color:var(--mute);font-size:14px}' +
    '#R .s-statgrid{display:grid;grid-template-columns:1fr 1.4fr;gap:30px;align-items:start}#R .s-lt h3{margin:0 0 6px;font:800 19px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.06em;text-transform:uppercase}#R .s-lt{margin:0 0 18px}#R .s-lt td,#R .s-lt th{padding:6px 8px;font-size:15px}#R .s-lt tbody th{font:600 15px Barlow,sans-serif;letter-spacing:0;text-transform:none;color:var(--navy);border-bottom:1px solid var(--line);white-space:normal}#R .n{text-align:right;font-variant-numeric:tabular-nums}#R .s-scroll{overflow-x:auto}#R .s-pl table{min-width:520px}#R .s-pl th.n,#R .s-pl td.n{padding:6px 7px}' +
    '#R .s-filter{display:flex;flex-wrap:wrap;gap:12px 20px;align-items:flex-end;margin:0 0 12px}#R .s-chips{display:flex;flex-wrap:wrap;gap:6px}#R .s-chips button{display:inline-flex!important;align-items:center;justify-content:center;flex:0 0 auto!important;width:auto!important;max-width:none!important;margin:0!important;min-height:40px;min-width:44px;padding:0 12px;background:#fff;color:var(--navy);border:2px solid var(--navy);font:800 15px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}#R .s-chips button[aria-pressed=true]{box-shadow:inset 0 -3px 0 var(--or);background:#f3f5f9}' +
    '#R .s-find{display:flex;flex-direction:column;font:700 12px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}#R .s-find input{min-height:44px;width:min(280px,100%);padding:0 10px;border:2px solid var(--navy);font:500 16px Barlow,sans-serif;color:var(--navy);background:#fff}' +
    '#R .s-clip.on{max-height:820px;overflow:hidden;position:relative}#R .s-clip.on:after{content:"";position:absolute;left:0;right:0;bottom:0;height:90px;background:linear-gradient(rgba(255,255,255,0),#fff);pointer-events:none}#R .s-more{display:block;margin:10px auto 0;min-height:44px;padding:0 22px;background:#fff;border:2px solid var(--navy);box-shadow:inset 0 -3px 0 var(--or);color:var(--navy);font:800 16px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}' +
    '#R table.ros{table-layout:fixed}#R .ros.nowt .wt{display:none}#R .ros th.ph,#R .ros td.ph{width:72px}#R .ros th.no{width:52px}#R .ros th.ps{width:68px}#R .ros th.cl{width:64px}#R .ros th.ht{width:68px}#R .ros th.wt{width:56px}#R .ros th.hm{width:24%}#R .ros th.pv{width:20%}#R .ros td.ht,#R .ros td.ps,#R .ros td.cl,#R .ros td.wt{white-space:nowrap}#R .ros td.ph{width:72px;padding:6px 10px}#R .ros td.ph img,#R .ros .p-ni{max-width:none;display:block;width:56px;height:56px;background:#eef1f6;object-fit:cover;object-position:top center}#R .ros td.no{width:46px;font:800 22px "Barlow Condensed",Barlow,sans-serif}#R .ros td.nm{font-weight:700}#R .ros td.nm small.m{display:none}#R .ros td.hm small{display:block;color:var(--mute);font-size:14px}#R .ros td.pv{color:var(--mute)}' +
    '#R .stt{display:inline-block;margin-left:8px;padding:0 6px;border:1px solid var(--navy);font:800 12px/18px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;vertical-align:2px}' +
    '#R .s-ail{margin:0;padding:0;list-style:none}#R .s-ail li{padding:8px 0;border-bottom:1px solid var(--line)}' +
    '#R .s-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px;margin:0;padding:0;list-style:none}#R .s-st .im{display:block;aspect-ratio:16/9;background:#e3e7ee;overflow:hidden}#R .s-st .im img{width:100%;height:100%;object-fit:cover;display:block}#R .s-st h3{margin:8px 0 2px;font:800 21px/1.12 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;min-height:3.36em}#R .s-st h3 a{text-decoration:none}#R .s-ph .im{background:#f1f3f7}#R .s-st .m{font:600 13px Barlow,sans-serif;color:var(--mute);letter-spacing:.04em;text-transform:uppercase;min-height:1.4em}' +
    '#R .s-seo{margin:34px 0 0;padding:26px 0 36px;border-top:1px solid var(--line);color:var(--mute);max-width:62em}#R .s-seo h2{margin:0 0 8px;font:800 26px/1.1 "Barlow Condensed",Barlow,sans-serif;text-transform:uppercase;color:var(--navy)}#R .s-seo h3{margin:16px 0 4px;font:800 19px "Barlow Condensed",Barlow,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:var(--navy)}#R .s-seo p{margin:0 0 8px}' +
    '@media(max-width:860px){#R .s-top .s-wrap,#R .s-statgrid{grid-template-columns:1fr}#R .s-wrap{padding:0 16px}#R .s-top{padding:22px 0 20px}#R .s-nav a{flex:1 1 40%;justify-content:center}#R .s-tiles{grid-template-columns:repeat(2,1fr)}#R .s-card{min-height:250px}}' +
    '@media(max-width:700px){#R .sch,#R .sch tbody{display:block;width:100%}#R .sch thead{display:none}#R .sch tr{display:grid;grid-template-columns:78px 1fr auto;grid-template-areas:"d o t" "d o v";gap:0 10px;padding:8px 0 8px 8px;border-bottom:1px solid var(--line)}#R .sch td{border:0;padding:1px 0;width:auto}#R .sch td.d{grid-area:d;width:auto;font:800 15px/1.2 "Barlow Condensed",Barlow,sans-serif;letter-spacing:.04em;text-transform:uppercase}#R .sch td.o{grid-area:o}#R .sch .vn{display:none}#R .sch .g-o img,#R .sch .g-o .lg{display:none}#R .sch td.t{grid-area:t;text-align:right;white-space:nowrap}#R .sch td.v{grid-area:v;text-align:right;font-size:14px;color:var(--mute)}#R .sch tr.nx td{background:none}#R .sch tr.nx{background:#f3f5f9}#R .sch tr.rk,#R .sch tr.nx{box-shadow:inset 3px 0 0 var(--or)}#R .sch tr.rk td:first-child,#R .sch tr.nx td:first-child{box-shadow:none}' +
    '#R .ros,#R .ros tbody{display:block;width:100%}#R .ros thead{display:none}#R .ros tr{display:grid;grid-template-columns:56px 40px 1fr;grid-template-areas:"ph no nm" "ph no hm" "ph no pv";gap:0 10px;padding:8px 0;border-bottom:1px solid var(--line)}#R .ros tr[hidden]{display:none}#R .ros td{border:0;padding:0}#R .ros td.ph{grid-area:ph;width:56px;padding:0}#R .ros td.no{grid-area:no;width:auto;text-align:right}#R .ros td.nm{grid-area:nm}#R .ros td.nm small.m{display:block;font-weight:400;color:var(--mute);font-size:14px}#R .ros td.hm{grid-area:hm;font-size:14px;color:var(--mute)}#R .ros td.hm small{display:inline;margin-left:4px}#R .ros td.hm small:before{content:"\u00b7 "}#R .ros td.pv{grid-area:pv;font-size:14px}#R .ros td.pv:empty{display:none}#R .ros td.ps,#R .ros td.cl,#R .ros td.ht,#R .ros td.wt{display:none}' +
    '#R .s-statgrid .s-tm{font-size:14px}#R .s-leaders table{font-size:14px}#R .s-lt td,#R .s-lt th{padding:5px 6px}}';

  function styles() { if (document.getElementById(ROOT + '-css')) return; var s = document.createElement('style'); s.id = ROOT + '-css'; s.textContent = CSS.replace(/#R/g, '#' + ROOT); document.head.appendChild(s); }
  function fonts() { if (document.getElementById('gbm-sh-font')) return; var l = document.createElement('link'); l.id = 'gbm-sh-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap'; document.head.appendChild(l); }

  function render(d) { return hero(d) + '<div class="s-wrap">' + storiesSec() + schedule(d) + statsSec(d) + rosterSec(d) + availSec(d) + seoSec(d) + '</div>'; }

  function anchorEl() { return document.getElementById('gbm-np') || document.getElementById('gbm-lf') || document.querySelector('[data-hook=feed-page-root]'); }
  function place(el) {
    var a = anchorEl(); if (!a || !a.parentNode) return false;
    if (el.parentNode !== a.parentNode || el.nextSibling !== a) a.parentNode.insertBefore(el, a);
    return true;
  }
  function paintLd() {
    var arr = ld(D), st = ldStories(), all = arr.concat(st ? [st] : []);
    all.forEach(function (j, i) { var id = ROOT + '-ld' + i, s = document.getElementById(id); if (!s) { s = document.createElement('script'); s.id = id; s.type = 'application/ld+json'; document.head.appendChild(s); } s.textContent = j; });
  }
  function setVw() { var w = document.documentElement.clientWidth; if (w > 300) document.documentElement.style.setProperty('--sh-vw', w + 'px'); }
  function mount() {
    if (!onRoute() || !D) return false;
    setVw();
    if (!HUB) {
      // The loader may already have reserved a full-screen placeholder (data-ph) where the hub goes; adopt it so the fill moves nothing.
      var ph = document.getElementById(ROOT), el = ph || document.createElement('section');
      if (ph && !ph.getAttribute('data-ph')) { HUB = ph; window[GLOBAL].ready = true; return true; }
      if (!ph) { el.id = ROOT; if (!place(el)) return false; }
      styles(); fonts();
      el.removeAttribute('data-ph'); el.removeAttribute('style'); el.setAttribute('data-build', BUILD); el.setAttribute('aria-label', CFG.title + ' hub');
      el.innerHTML = render(D);
      HUB = el; paintLd(); window[GLOBAL].ready = true; return true;
    }
    place(HUB); return true;
  }
  function repaintCard() { var c = document.getElementById(ROOT + '-card'); if (c && D) { var h = heroCard(D); if (c.innerHTML !== h) c.innerHTML = h; } }
  function repaintAll() {
    if (!HUB || !D) return;
    var sched = document.getElementById(ROOT + '-sched'), nh = (function () { var t = document.createElement('div'); t.innerHTML = schedule(D); return t.firstChild; })();
    if (sched && nh && sched.outerHTML !== nh.outerHTML) sched.replaceWith(nh);
    repaintCard();
    var bd = HUB.querySelector('.s-badges'); if (bd) { var b = badges(D); if (bd.innerHTML !== b) bd.innerHTML = b; }
    paintLd();
  }
  function repaintRoster() { var tb = document.getElementById(ROOT + '-rb'); if (tb && D) tb.innerHTML = rosterRows(D); }

  /* ---------- live data ---------- */
  function getJson(urls, i) { i = i || 0; if (i >= urls.length) return Promise.reject(0); return fetch(urls[i], { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).catch(function () { return getJson(urls, i + 1); }); }
  function refreshEspn() {
    if (!ESPN) return Promise.resolve();
    return Promise.all([getJson(ESPN.map(function (b) { return b + '/teams/57/schedule'; })).catch(function () { return null; }), getJson(ESPN.map(function (b) { return b + '/rankings'; })).catch(function () { return null; })]).then(function (r) {
      if (!r[0] || !onRoute()) return;
      var g = normSchedule(r[0], D.games);
      if (g.length < CFG.minGames) return;
      D.games = g; D.rank = normRank(r[1], D.rank); D.fetchedAt = new Date().toISOString(); repaintAll(); bbCatchUp();
    }).catch(function () {});
  }
  function bbCatchUp() {
    if (!D || !D.bb || !ESPN || !CFG.boxStats) return Promise.resolve();
    var todo = D.games.filter(function (g) { return g.state === 'post' && D.bb.ids.indexOf(g.id) < 0; }).slice(0, 40), changed = false;
    return todo.reduce(function (pr, g) {
      return pr.then(function () { return getJson(ESPN.map(function (b) { return b + '/summary?event=' + g.id; })).then(function (sum) { if (bbAdd(D.bb, sum)) changed = true; }).catch(function () {}); });
    }, Promise.resolve()).then(function () {
      if (!changed || !onRoute()) return;
      var a = document.getElementById(ROOT + '-stats'), t = document.createElement('div'); t.innerHTML = bbStatsSec(D); if (a && t.firstChild) a.replaceWith(t.firstChild);
    });
  }
  var polls_n = 0, pollTimer = 0;
  function readHeader() {
    return fetch(HEADER + '&cb=' + Math.floor(Date.now() / 15000), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (h) {
      var found = null;
      (h.sports || []).forEach(function (sp) { (sp.leagues || []).forEach(function (lg) { (lg.events || []).forEach(function (e) {
        var fl = null, op = null; (e.competitors || []).forEach(function (c) { if (c.id === '57') fl = c; else op = c; });
        if (fl && op) found = { id: e.id, state: e.status, summary: e.summary || '', fl: fl.score, opp: op.score, oppName: (op.displayName || '').replace(/ [A-Z][A-Za-z.'-]+( [A-Z][A-Za-z.'-]+)?$/, '') || op.abbreviation, oppRank: op.rank && op.rank < 99 ? op.rank : null, flRank: fl.rank && fl.rank < 99 ? fl.rank : null, date: e.date };
      }); }); });
      LIVE = found; repaintCard();
      if (D && D.games) D.games.forEach(function (g) { if (found && g.id === found.id) g.state = found.state; });
      return found;
    });
  }
  function scheduleHeader(found) {
    if (pollTimer) { clearTimeout(pollTimer); pollTimer = 0; }
    var ng = D && nextGame(D), soon = ng && !ng.tbd && !ng.fgDay && (new Date(ng.date).getTime() - Date.now()) < 90 * 6e4;
    if (!onRoute() || polls_n > 480 || !((found && found.state === 'in') || soon)) return;
    pollTimer = setTimeout(function () { if (!onRoute()) return; polls_n++; if (document.hidden) return scheduleHeader(found); readHeader().then(function (f) { if (f && f.state === 'post') refreshEspn(); scheduleHeader(f); }).catch(function () { scheduleHeader(found); }); }, 30000);
  }
  /* Football only: the team's own data files are re-read so a merged update shows without a rebuild. Same-size text swaps only. */
  function refreshFiles() {
    (CFG.liveFiles || []).forEach(function (f) {
      fetch(DATA_BASE + f.file + '?cb=' + Math.floor(Date.now() / 60000), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
        if (!onRoute() || !D) return;
        if (f.kind === 'roster' && j.players && j.updated && j.updated !== D.rosterStamp) {
          D.roster = j.players.map(function (p) { return { no: p.no, name: p.name, pos: p.pos, cls: p.yr, ht: p.ht, wt: p.wt, home: p.home, school: p.school, prev: String(p.prev || '').replace(/^Previous School:\s*/, ''), img: p.img, url: p.url }; });
          D.status = j.status || {}; D.availability = j.availability || {}; D.rosterStamp = j.updated; D.rosterUpdated = j.updatedLabel || D.rosterUpdated;
          var a = document.getElementById(ROOT + '-avail'), t = document.createElement('div'); t.innerHTML = availSec(D); if (a && t.firstChild) a.replaceWith(t.firstChild);
          repaintRoster();
        }
        if (f.kind === 'bb' && j.bb && j.bb.updated && D.bb && j.bb.updated !== D.bb.updated) {
          D.bb = j.bb; var sb = document.getElementById(ROOT + '-stats'), t3 = document.createElement('div'); t3.innerHTML = bbStatsSec(D); if (sb && t3.firstChild) sb.replaceWith(t3.firstChild);
        }
        if (f.kind === 'stats' && j.tiles && j.updated && D.stats && j.updated !== D.stats.updated) {
          D.stats = { tiles: j.tiles, teamRows: j.teamRows, lead: j.lead, through: j.through, updatedLabel: j.updatedLabel, updated: j.updated, src: j.src, source: j.source };
          var s = document.getElementById(ROOT + '-stats'), t2 = document.createElement('div'); t2.innerHTML = statsSec(D); if (s && t2.firstChild) s.replaceWith(t2.firstChild);
        }
      }).catch(function () {});
    });
  }

  /* ---------- stories ---------- */
  function pathOf(u) { try { return new URL(u, location.origin).pathname.replace(/\/+$/, ''); } catch (e) { return u; } }
  function ago(ts) { var q = et(ts), n = et(Date.now()); return q.y === n.y && q.m === n.m && q.d === n.d ? 'Today' : MON[q.m] + ' ' + q.d + (q.y !== n.y ? ', ' + q.y : ''); }
  function nativeStories() {
    var fr = document.querySelector('[data-hook=feed-page-root]'), out = [];
    if (!fr) return out;
    [].slice.call(fr.querySelectorAll('[data-hook=post-list-item]')).forEach(function (it) {
      var a = it.querySelector('a[href*="/post/"]'), t = it.querySelector('[data-hook=post-title]'), im = it.querySelector('img[src^="http"]');
      if (!a) return; var title = (t ? t.textContent : a.textContent || '').replace(/\s+/g, ' ').trim(); if (!title) return;
      out.push({ url: pathOf(a.getAttribute('href')), title: title, img: im ? im.getAttribute('src') : '' });
    });
    return out;
  }
  function loadStories() {
    var nat = nativeStories(), byPath = {};
    return fetch('/blog-feed.xml?gbsh=' + Date.now(), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (t) {
      var x = new DOMParser().parseFromString(t, 'text/xml');
      return [].slice.call(x.querySelectorAll('item')).map(function (i) {
        var g = function (n) { var e = i.getElementsByTagName(n)[0]; return e ? e.textContent : ''; }, en = i.getElementsByTagName('enclosure')[0], cats = [].slice.call(i.getElementsByTagName('category')).map(function (c) { return c.textContent; });
        return { url: pathOf(g('link')), title: g('title'), by: g('dc:creator'), ts: Date.parse(g('pubDate')), img: en ? en.getAttribute('url') : '', ok: cats.indexOf(CFG.feedCategory) > -1 };
      });
    }).catch(function () { return []; }).then(function (rss) {
      rss.forEach(function (r) { byPath[r.url] = r; });
      var seen = {}, list = [];
      rss.filter(function (r) { return r.ok; }).sort(function (a, b) { return b.ts - a.ts; }).forEach(function (r) { if (!seen[r.url]) { seen[r.url] = 1; list.push(r); } });
      nat.forEach(function (n) { if (seen[n.url]) return; seen[n.url] = 1; var r = byPath[n.url]; list.push({ url: n.url, title: n.title, img: (r && r.img) || n.img, by: r ? r.by : '', ts: r ? r.ts : 0 }); });
      if (!list.length) { DONE = true; var c0 = document.getElementById(ROOT + '-cards'); if (c0) c0.innerHTML = storyCards(); return; }
      STORIES = list.slice(0, 6).map(function (s) { s.when = s.ts ? ago(s.ts) : ''; if (s.img && s.img.indexOf('static.wixstatic.com/media/') > -1) s.img = s.img.replace(/\/v1\/(?:fill|fit)\/[^/]+\//, '/v1/fit/w_480,h_270,al_c,q_75/').replace(/\/file\.(png|jpe?g)$/i, '/file.webp'); return s; });
      var c = document.getElementById(ROOT + '-cards'); if (c) { var h = storyCards(); if (c.innerHTML !== h) c.innerHTML = h; }
      paintLd();
    });
  }

  /* ---------- wiring ---------- */
  function onClick(e) {
    var mb = e.target.closest && e.target.closest('#' + ROOT + ' [data-more]');
    if (mb) { var cl = document.getElementById(ROOT + '-clip'); if (cl) cl.classList.remove('on'); mb.remove(); return; }
    var b = e.target.closest && e.target.closest('#' + ROOT + ' [data-pos]'); if (!b) return;
    RPOS = b.getAttribute('data-pos'); var cl2 = document.getElementById(ROOT + '-clip'); if (cl2) cl2.classList.remove('on'); var m2 = HUB.querySelector('[data-more]'); if (m2) m2.remove();
    [].slice.call(HUB.querySelectorAll('[data-pos]')).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    repaintRoster();
  }
  function onInput(e) { if (e.target && e.target.id === ROOT + '-q') { RQ = e.target.value || ''; var cl = document.getElementById(ROOT + '-clip'); if (cl) cl.classList.remove('on'); var m = HUB.querySelector('[data-more]'); if (m) m.remove(); repaintRoster(); } }
  function start() {
    if (!onRoute()) return;
    if (!D) D = JSON.parse(JSON.stringify(SNAP));
    if (D.fgGames) D.games = fgGames(D.fgGames);
    // Mount in the same task the native list appears (MutationObserver) so the hub is in place before the browser paints that list: nothing is pushed down after first paint.
    // A bounded backup tick (2 min) re-attaches the SAME element if Wix replaces the page container; nothing is rebuilt.
    var mo = null;
    if (window.MutationObserver) {
      mo = new MutationObserver(function () { if (!onRoute()) return; if (!HUB || !HUB.isConnected || HUB.nextSibling !== anchorEl()) mount(); });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(function () { if (mo) mo.disconnect(); mo = null; }, 120000);
    }
    var ticks = 0, iv = setInterval(function () { ticks++; if (!onRoute() || ticks > 120) { clearInterval(iv); return; } mount(); }, 1000);
    mount();
    setTimeout(function () { if (!onRoute()) return; refreshEspn(); if (HEADER) readHeader().then(scheduleHeader).catch(function () {}); refreshFiles(); setTimeout(function () { loadStories().catch(function () {}); }, 800); setTimeout(function () { loadStories().catch(function () {}); }, 6000); }, 400);
  }
  function sync() {
    if (onRoute()) { if (!HUB) { start(); } else { place(HUB); } return; }
    if (HUB) { HUB.remove(); HUB = null; }
    for (var i = 0; i < 4; i++) { var s = document.getElementById(ROOT + '-ld' + i); if (s) s.remove(); }
    window[GLOBAL].ready = false; if (pollTimer) { clearTimeout(pollTimer); pollTimer = 0; }
  }
  window[GLOBAL] = { sync: sync, ready: false, build: BUILD };
  document.addEventListener('click', onClick); document.addEventListener('input', onInput); window.addEventListener('resize', setVw);
  window.addEventListener('popstate', sync); window.addEventListener('gbmroutechange', sync);
  start();
})();
