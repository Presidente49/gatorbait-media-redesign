// GatorBait Gazette story alert: PRE-SEND CHECKLIST (read-only).
// Paste this whole function into mcp__Wix__ExecuteWixAPI (hasMutations: false, siteId 18fb3a4e-d7f6-414a-aeb9-3047db3ea115)
// after editing CFG. It performs GET and read-only POST queries only. It never sends, publishes, switches an automation,
// or changes a contact. It returns counts and pass/fail only: no emails, no contact IDs.
//
// The send-governor (automation/newsletter/send-governor.js, run by Jarvis) is authoritative. Pass its verdict in
// CFG.governorOk; the "governor mirror" below only cross-checks the 24h and 7-day send counts from Wix's own campaign list.
// Every check must pass. A single failed check means no publish call.
async () => {
  const CFG = {
    postUrl: 'https://www.gatorbaitmedia.com/post/REPLACE-SLUG',
    slug: 'REPLACE-SLUG',                       // same slug given to build-story-alert.mjs (utm_campaign=story_alert_<slug>)
    labelKey: 'custom.REPLACE-DAILY-NEWS-LABEL-KEY', // the verified GatorBait Daily News opt-in label (key, not display name)
    governorOk: false,                          // Jarvis sets true only after the send-governor returns ok:true
    sampleSize: 90,                             // consent re-check size; multiples of 30. Use 0 to re-check the whole label.
    caps: { perDay: 1, perWeek: 7 },            // governor policy caps (Lesson 48; confirm against the governor)
    maxBounceRate: 0.02, maxComplaintRate: 0.001,
    holdLabelKeys: ['custom.gatorbait-do-not-market', 'custom.gatorbait-re-opt-in-candidates', 'custom.gatorbait-inactive-6mo-oh3AK', 'custom.bounced', 'custom.spam-complaints'],
    blogAlertAutomationIds: ['5006baf5-fbbf-440c-a012-a09bdbd95fc9', '824714d4-7e31-4b1d-95b2-ccec04d788af'],
  };
  const checks = [];
  const add = (name, pass, detail) => checks.push({ name, pass: !!pass, detail });
  const W = 'https://www.wixapis.com';
  const get = async (url) => (await wix.request({ scope: 'site', method: 'GET', url })).data;
  const post = async (url, body) => (await wix.request({ scope: 'site', method: 'POST', url, body })).data;
  const total = async (filter) => (await post(W + '/contacts/v4/contacts/query', { query: { filter, paging: { limit: 1 }, fieldsets: ['BASIC'] } })).pagingMetadata.total;
  const slugToken = 'story_alert_' + CFG.slug.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 80);

  // 1. Both blog alert automations INACTIVE.
  const autos = [];
  for (const id of CFG.blogAlertAutomationIds) {
    const a = (await get(W + '/automations-service/v2/automations/' + id)).automation;
    autos.push({ id: id.slice(0, 8), status: a.configuration.status, revision: a.revision });
  }
  add('blog alert automations INACTIVE', autos.every((a) => a.status === 'INACTIVE'), autos);

  // 2. Account and sender reputation.
  const acct = (await get(W + '/email-marketing/v1/account-details')).accountDetails;
  add('email account ACTIVE and rank GOOD', acct.status === 'ACTIVE' && acct.rank === 'GOOD', { status: acct.status, rank: acct.rank, emailsUsed: acct.quotaPeriod && acct.quotaPeriod.quotaUsage && acct.quotaPeriod.quotaUsage.emails });

  // 3. Governor verdict supplied by Jarvis.
  add('send-governor returned ok:true', CFG.governorOk === true, { governorOk: CFG.governorOk });

  // 4. Audience label exists and is a label of its own (never the whole eligible pool).
  const labels = (await get(W + '/contacts/v4/labels?paging.limit=500')).labels || [];
  const label = labels.find((l) => l.key === CFG.labelKey);
  add('daily-news label exists', !!label, { found: !!label });
  const POOL_KEY = 'custom.gatorbait-active-email-audience';
  add('label is not the whole eligible pool', CFG.labelKey !== POOL_KEY, { labelKey: CFG.labelKey === POOL_KEY ? POOL_KEY : '(dedicated)' });
  let labelIdForPublish = null;
  if (label) {
    labelIdForPublish = label.legacyId; // publish emailDistributionOptions.labelIds takes this GUID (same id the automation stores)
    const inLabel = { 'info.labelKeys': { $hasSome: [CFG.labelKey] } };
    const eligibleClause = [
      { 'primaryEmail.subscriptionStatus': { $eq: 'SUBSCRIBED' } },
      { 'primaryEmail.deliverabilityStatus': { $in: ['VALID', 'NOT_SET'] } },
    ];
    const labelled = await total(inLabel);
    const eligible = await total({ $and: [inLabel, ...eligibleClause] });
    const holdOverlap = {};
    for (const k of CFG.holdLabelKeys) holdOverlap[k.replace(/^custom\./, '')] = await total({ 'info.labelKeys': { $hasAll: [CFG.labelKey, k] } });
    const holdTotal = Object.values(holdOverlap).reduce((a, b) => a + b, 0);
    add('label has members', labelled > 0, { labelled });
    add('label membership diff is zero (every member SUBSCRIBED, VALID/NOT_SET)', labelled === eligible, { labelled, eligible, diff: labelled - eligible });
    add('no member carries a hold, Do Not Market, bounced or spam label', holdTotal === 0, holdOverlap);

    // 5. Consent and deliverability re-check against the Email Subscriptions API, batches of 30 emails or fewer.
    const sampleTarget = CFG.sampleSize > 0 ? Math.min(CFG.sampleSize, labelled) : labelled;
    const emails = [];
    for (let off = 0; emails.length < sampleTarget && off < labelled; off += 100) {
      const page = await post(W + '/contacts/v4/contacts/query', { query: { filter: inLabel, paging: { limit: 100, offset: off }, fieldsets: ['BASIC'] } });
      for (const c of page.contacts || []) {
        const e = c.primaryInfo && c.primaryInfo.email;
        if (e) emails.push(String(e).toLowerCase());
      }
      if (!(page.contacts || []).length) break;
    }
    const checked = emails.slice(0, sampleTarget);
    let returned = 0, ok = 0, bad = 0;
    for (let i = 0; i < checked.length; i += 30) {
      const batch = checked.slice(i, i + 30);
      const r = await post(W + '/email-marketing/v1/email-subscriptions/query', { filter: { email: { $in: batch } }, paging: { limit: 30 } });
      const subs = r.subscriptions || [];
      returned += subs.length;
      for (const s of subs) (s.subscriptionStatus === 'SUBSCRIBED' && ['VALID', 'NOT_SET'].includes(s.deliverabilityStatus)) ? ok++ : bad++;
    }
    add('consent re-check: every requested email returned a record and is SUBSCRIBED + VALID/NOT_SET', checked.length > 0 && returned === checked.length && bad === 0, { requested: checked.length, returned, ok, notEligible: bad, batchSize: 30, scope: CFG.sampleSize > 0 ? 'sample' : 'full label' });
  }

  // 6. Campaign history: recent volume (governor mirror), bounce/complaint rate, duplicate for this post.
  const list = (await get(W + '/email-marketing/v1/campaigns?paging.limit=100')).campaigns || [];
  const now = Date.now();
  const sentLike = list.filter((c) => c.publishingData && c.publishingData.datePublished && ['SAMPLING', 'SENDING', 'DISTRIBUTED'].includes(c.distributionStatus));
  const within = (c, ms) => now - new Date(c.publishingData.datePublished).getTime() <= ms;
  const last24 = sentLike.filter((c) => within(c, 864e5)).length;
  const last7 = sentLike.filter((c) => within(c, 7 * 864e5)).length;
  add('governor mirror: sends in last 24h below cap', last24 < CFG.caps.perDay, { last24h: last24, cap: CFG.caps.perDay });
  add('governor mirror: sends in last 7 days below cap', last7 < CFG.caps.perWeek, { last7d: last7, cap: CFG.caps.perWeek });
  let delivered = 0, bounced = 0, complained = 0;
  const recentIds = sentLike.filter((x) => within(x, 7 * 864e5)).map((x) => x.campaignId).slice(0, 100);
  if (recentIds.length) {
    const st = await get(W + '/email-marketing/v1/campaigns/statistics?' + recentIds.map((id) => 'campaignIds=' + id).join('&'));
    for (const row of st.statistics || []) {
      const s = row.email || {};
      delivered += s.delivered || 0; bounced += s.bounced || 0; complained += s.complained || 0;
    }
  }
  const base = delivered + bounced || 1;
  add('7-day bounce and complaint rates within limits', bounced / base <= CFG.maxBounceRate && complained / base <= CFG.maxComplaintRate, { delivered, bounced, complained, bounceRate: +(bounced / base).toFixed(4), complaintRate: +(complained / base).toFixed(4) });

  // Duplicate: no non-draft campaign already carries this post's tracking token or permalink.
  let dupes = 0, scanned = 0, draftsForPost = 0, unreadable = 0;
  for (const c of list.filter((x) => now - new Date(x.dateUpdated || x.dateCreated).getTime() <= 60 * 864e5).slice(0, 60)) {
    try {
      const comp = await get(W + '/email-marketing/v1/campaigns/' + c.campaignId + '/composer');
      scanned++;
      const hit = JSON.stringify(comp.composer && comp.composer.composerDataJson || '').includes(slugToken) || JSON.stringify(comp.composer && comp.composer.composerDataJson || '').includes(CFG.postUrl);
      if (!hit) continue;
      if (c.publishingData && c.publishingData.datePublished) dupes++; else draftsForPost++;
    } catch (e) { unreadable++; }
  }
  add('duplicate check: no sent campaign already carries this post URL', dupes === 0 && unreadable === 0, { campaignsScanned: scanned, alreadySent: dupes, unreadable, draftsForThisPost: draftsForPost });

  return { pass: checks.every((c) => c.pass), failed: checks.filter((c) => !c.pass).map((c) => c.name), checks, labelIdForPublish: labelIdForPublish ? '(present; read it from the label list when publishing)' : null };
}
