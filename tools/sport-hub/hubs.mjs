// Per-sport configuration and snapshot loaders for the GatorBait sport hub template (sports-live/src/sport-hub.js).
// Adding a sport = one entry here + its cached data under sports-live/hub-data/. Never invent a field: leave it out.
import fs from 'node:fs';

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const CAT = '/gatorbait-media-blogs/categories/';

const common = {
  finalHours: 40, minGames: 1, confName: 'SEC', chipConf: true, coachWord: 'Coach', eventWord: 'game', eventPlural: 'games', oppHead: 'Opponent', oppHeadRoster: 'Hometown',
  timeNote: 'Times Eastern. A ranked opponent shows its current AP rank.', schoolHead: 'High school', ldOrg: 'Southeastern Conference', showZeroRecord: false, liveFiles: [],
};

export const HUBS = {
  football: {
    cfg: {
      ...common, key: 'football', route: CAT + 'gator-football', title: 'Florida Gators football', shortName: 'football', kicker: 'Gator football hub', nameHtml: 'Florida Gators<br>Football',
      lede: 'Live score, schedule and TV, season stats and the full roster for Jon Sumrall’s Florida Gators, with GatorBait’s coverage below.',
      espn: { path: 'football/college-football', sport: 'football', league: 'college-football', web: 'college-football' },
      minGames: 8, rosterClip: 24, seasonLabel: '2026 season', schedHeading: 'Florida football schedule, results and TV', schedSource: 'ESPN. TV listings are ESPN’s current data and can change.',
      statsHeading: 'Florida football season stats', rosterHeading: '2026 Florida football roster', rosterUrl: 'https://floridagators.com/sports/football/roster', rosterLink: '/roster', storiesHeading: 'Latest Florida football coverage',
      feedCategory: 'Gator Football', liveFiles: [{ file: 'florida-roster.json', kind: 'roster' }, { file: 'florida-stats.json', kind: 'stats' }],
      posNames: { QB: 'quarterback', RB: 'running back', WR: 'wide receiver', TE: 'tight end', OL: 'offensive lineman', DL: 'defensive lineman', ILB: 'inside linebacker', JACK: 'jack linebacker', CB: 'cornerback', S: 'safety', STAR: 'star', K: 'kicker', P: 'punter', LS: 'long snapper' },
      ldName: 'Florida Gators football', ldSport: 'American football', ldDesc: 'Florida Gators football schedule, TV, season stats, roster and news from GatorBait Media.',
      seoHeading: 'Florida Gators football coverage',
      seoHtml: '<p>GatorBait Media covers Florida football all season: game stories, analysis, press conferences and recruiting. This page keeps the Florida football schedule, TV channels, final box-score stats and the full roster in one place, and the story list below it is every football story we have published.</p>' +
        '<h3>Florida football schedule and how to watch</h3><p>Each Florida game lists its date, kickoff time in Eastern, TV network and site from ESPN. A game still marked TV TBA will be filled in as networks are chosen.</p>' +
        '<h3>Florida football roster</h3><p>The roster is copied from FloridaGators.com with each player’s number, position, class, height, weight, hometown, high school and previous school. Injury and availability detail is on the <a href="/roster">Gators roster page</a>. For hoops, see <a href="/gatorbait-media-blogs/categories/gator-basketball">Gator basketball</a>.</p>',
    },
    snapshot() {
      const sched = readJson('sports-live/hub-data/football-espn-schedule.json'), rank = readJson('sports-live/hub-data/football-espn-rankings.json');
      const r = readJson('sports-live/florida-roster.json'), s = readJson('sports-live/florida-stats.json');
      return {
        sched, rank, hasConf: true, team: { coach: 'Jon Sumrall' },
        roster: r.players.map((p) => ({ no: p.no, name: p.name, pos: p.pos, cls: p.yr, ht: p.ht, wt: p.wt, home: p.home, school: p.school, prev: String(p.prev || '').replace(/^Previous School:\s*/, ''), img: p.img, url: p.url })),
        status: r.status || {}, availability: r.availability || {}, rosterStamp: r.updated, rosterUpdated: r.updatedLabel,
        stats: { tiles: s.tiles, teamRows: s.teamRows, lead: s.lead, through: s.through, updatedLabel: s.updatedLabel, updated: s.updated, src: s.src },
      };
    },
  },
  'womens-basketball': {
    cfg: {
      ...common, key: 'womens-basketball', route: CAT + 'gator-womens-basketball', title: 'Florida Gators women’s basketball', shortName: 'women’s basketball', kicker: 'Gator women’s basketball hub', nameHtml: 'Florida Gators<br>Women’s Basketball', coachWord: 'Head coach',
      lede: 'Live score, schedule and TV, season stats and the full roster for Tammi Reiss’s Florida Gators, with GatorBait’s coverage below.',
      espn: { path: 'basketball/womens-college-basketball', sport: 'basketball', league: 'womens-college-basketball', web: 'womens-college-basketball' },
      minGames: 10, anchors: true, liveFiles: [{ file: 'hub-data/womens-basketball-uf-stats.json', kind: 'bb' }], seasonLabel: '2026-27 season', schedHeading: 'Florida women’s basketball schedule, results and TV', schedSource: 'ESPN. TV listings are ESPN’s current data and can change.',
      statsHeading: 'Florida women’s basketball season stats', rosterHeading: '2026-27 Florida women’s basketball roster', rosterUrl: 'https://floridagators.com/sports/womens-basketball/roster', storiesHeading: 'Latest Florida women’s basketball coverage',
      feedCategory: 'Gator Women\'s Basketball', posNames: { G: 'guard', F: 'forward', C: 'center' },
      ldName: 'Florida Gators women’s basketball', ldSport: 'Basketball', ldDesc: 'Florida Gators women’s basketball schedule, TV, season stats, roster and news from GatorBait Media.',
      seoHeading: 'Florida Gators women’s basketball coverage',
      seoHtml: '<p>GatorBait Media covers Florida women’s basketball: game stories, analysis and the road through the SEC. This page keeps the Florida women’s basketball schedule, TV channels, season stats compiled from final box scores and the full roster in one place, with every women’s basketball story below.</p>' +
        '<h3>Florida women’s basketball schedule and how to watch</h3><p>Each game lists its date, tipoff time in Eastern, TV network and site from ESPN. A game still marked TV TBA will be filled in as networks are chosen.</p>' +
        '<h3>Florida women’s basketball roster</h3><p>The roster is copied from FloridaGators.com with each player’s number, position, class, height, hometown, high school and previous school. For the men’s team, see <a href="/gatorbait-media-blogs/categories/gator-basketball">Gator basketball</a>.</p>',
    },
    snapshot() {
      const sched = readJson('sports-live/hub-data/womens-basketball-espn-schedule.json'), rank = readJson('sports-live/hub-data/womens-basketball-espn-rankings.json');
      const r = readJson('sports-live/hub-data/womens-basketball-roster.json'), uf = readJson('sports-live/hub-data/womens-basketball-uf-stats.json');
      return {
        sched, rank, bb: uf.bb, hasConf: true, team: { coach: (r.coaches.filter((c) => /Head .*Coach$/i.test(c.title))[0] || {}).name || '' }, coaches: r.coaches.slice(0, 4),
        roster: r.players.map((p) => ({ no: p.no, name: p.name, pos: p.pos, cls: p.cls, ht: p.ht, wt: p.wt, home: p.home, school: p.school, prev: p.prev, img: p.img, url: p.url })), rosterUpdated: 'Nov. 3, 2026',
      };
    },
  },
  'womens-gymnastics': {
    cfg: {
      ...common, key: 'gymnastics', route: CAT + 'gator-gymnastics', title: 'Florida Gators gymnastics', shortName: 'gymnastics', kicker: 'Gator gymnastics hub', nameHtml: 'Florida Gators<br>Gymnastics', coachWord: 'Head coach',
      lede: 'The 2027 Florida gymnastics schedule and TV, the full roster and GatorBait’s coverage in one place, from Skye Blakely’s world medals to the first meet of the season.',
      espn: null, seasonLabel: '2027 season', eventWord: 'meet', eventPlural: 'meets', oppHead: 'Meet', timeNote: 'Dates, times and TV as listed by FloridaGators.com. A blank time means none is posted yet.', schedHeading: 'Florida gymnastics schedule', schedSource: 'FloridaGators.com. The official schedule can change; check it before you travel.',
      rosterHeading: '2027 Florida gymnastics roster', rosterUrl: 'https://floridagators.com/sports/womens-gymnastics/roster', schoolHead: 'Club', storiesHeading: 'Latest Florida gymnastics coverage', feedCategory: 'Gator Gymnastics',
      posNames: { AA: 'all-around gymnast' }, chipConf: false, ldName: 'Florida Gators gymnastics', ldSport: 'Gymnastics', ldDesc: 'Florida Gators gymnastics schedule, roster and news from GatorBait Media.',
      seoHeading: 'Florida Gators gymnastics coverage',
      seoHtml: '<p>GatorBait Media covers Florida gymnastics: meet stories, analysis, roster news and the road to the SEC Championship. This page keeps the Florida gymnastics schedule, TV and roster in one place, with every gymnastics story below.</p>' +
        '<h3>Florida gymnastics schedule</h3><p>The schedule lists each meet with its date, time and site as posted by FloridaGators.com. Meets without a posted time or TV channel say so and are updated as the school announces them.</p>' +
        '<h3>Florida gymnastics roster</h3><p>The roster is copied from FloridaGators.com with each gymnast’s class, height, hometown and club. For football, see <a href="/gatorbait-media-blogs/categories/gator-football">Gator football</a>.</p>',
    },
    snapshot() {
      const r = readJson('sports-live/hub-data/womens-gymnastics-roster.json'), sc = readJson('sports-live/hub-data/womens-gymnastics-schedule.json');
      return {
        hasConf: false, team: { coach: (r.coaches.filter((c) => /^Head Coach$/i.test(c.title))[0] || {}).name || '' }, coaches: r.coaches.slice(0, 4), rank: null,
        fgGames: sc.games, games: [], roster: r.players.map((p) => ({ no: p.no, name: p.name, pos: p.pos, cls: p.cls, ht: p.ht, wt: p.wt, home: p.home, school: p.school, prev: p.prev, img: p.img, url: p.url })),
        rosterUpdated: 'Nov. 3, 2026',
      };
    },
  },
};
