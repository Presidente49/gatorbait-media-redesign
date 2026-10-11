async () => {
  // GatorBait send governor. Paste this whole file into ExecuteWixAPI (site
  // 18fb3a4e-d7f6-414a-aeb9-3047db3ea115, hasMutations false) before ANY list
  // email: a campaign, a breaking email, a newsletter, or switching an email
  // automation on. Send only when it returns ok: true.
  // Why these limits: docs/GATORBAIT-PUBLISHING-EMAIL-PLAYBOOK.md, "Send governor".
  // One roundup a day (Brenden, Sept. 28, 2026); the week limit is 7.
  const MAX_SENDS_PER_DAY = 1;
  const MAX_SENDS_PER_WEEK = 7;
  // Sends before this ISO time don't count toward either cap. null counts every
  // send. The controller (Jarvis) sets it; "2026-09-28T07:35:00Z" is when the
  // one-a-day policy started.
  const COUNT_FROM = null;
  const MAX_BOUNCE_RATE = 0.02;
  const MAX_COMPLAINT_RATE = 0.001;
  const DAY_MS = 24 * 60 * 60 * 1000;
  // Distribution states that mean the campaign has gone out, is going out or is queued.
  const SENT_STATES = [
    "SCHEDULED",
    "IN_DETECTION",
    "IN_MODERATION",
    "SAMPLING",
    "SENDING",
    "DISTRIBUTED",
    "PAUSED"
  ];
  const now = Date.now();
  const reasons = [];
  const read = res => (res && res.data) || res || {};

  // 1. The account must be ACTIVE. WARNED, SUSPENDED or BANNED can only be
  // cleared by the site owner in the Wix Email Marketing dashboard.
  const accountRes = await wix.request({
    method: "GET",
    url: "https://www.wixapis.com/email-marketing/v1/account-details"
  });
  const account = read(accountRes).accountDetails || {};
  const quota = account.quotaPeriod || {};
  const summary = {
    status: account.status,
    rank: account.rank,
    quotaUsage: quota.quotaUsage,
    quotaPeriod: [quota.dateFrom, quota.dateTo]
  };
  if (account.status !== "ACTIVE") {
    reasons.push(`Email Marketing account is ${account.status}; only the site owner can clear it in the Wix Email Marketing dashboard. Campaign calls return 401 until then.`);
    return { ok: false, reasons, account: summary };
  }

  // 2. Blog story-alert automations stay off (decision 4, Sept. 28, 2026).
  const alertQuery = {
    query: {
      filter: {
        "configuration.trigger.triggerKey": "wix_blog-new_blog_post"
      }
    }
  };
  const alertRes = await wix.request({
    method: "POST",
    url: "https://www.wixapis.com/automations-service/v2/automations/query",
    body: alertQuery
  });
  const activeAlerts = (read(alertRes).automations || [])
    .filter(a => a.configuration && a.configuration.status === "ACTIVE")
    .map(a => `${a.id} "${a.name}"`);
  if (activeAlerts.length) {
    reasons.push(`Blog story-alert automation is ACTIVE (decision 4 says off): ${activeAlerts.join(", ")}`);
  }

  // 3. Frequency caps and list health, from published campaigns.
  const listRes = await wix.request({
    method: "GET",
    url: "https://www.wixapis.com/email-marketing/v1/campaigns?visibilityStatuses=PUBLISHED&optionIncludeStatistics=true&paging.limit=100"
  });
  const sends = (read(listRes).campaigns || [])
    .filter(c => SENT_STATES.includes(c.distributionStatus))
    .map(c => {
      const published = c.publishingData || {};
      const stats = (published.statistics && published.statistics.emailCampaign) || {};
      return {
        id: c.campaignId,
        subject: c.emailSubject || c.title,
        state: c.distributionStatus,
        sentAt: published.datePublished || c.dateUpdated,
        delivered: stats.delivered || 0,
        bounced: stats.bounced || 0,
        complained: stats.complained || 0
      };
    });
  // A scheduled campaign counts against the window it is about to send in.
  const within = ms => sends.filter(s => s.state === "SCHEDULED" || now - Date.parse(s.sentAt) < ms);
  // Caps count only sends from COUNT_FROM on; rates below always use the full week.
  const countFrom = COUNT_FROM ? Date.parse(COUNT_FROM) : -Infinity;
  const counted = ms => within(ms).filter(s => s.state === "SCHEDULED" || Date.parse(s.sentAt) >= countFrom);
  const lastWeek = within(7 * DAY_MS);
  const dayCount = counted(DAY_MS).length;
  const weekCount = counted(7 * DAY_MS).length;
  const since = COUNT_FROM ? ` counted since ${COUNT_FROM}` : "";
  if (dayCount >= MAX_SENDS_PER_DAY) {
    reasons.push(`${dayCount} list send(s) in the last 24 hours${since}; the cap is ${MAX_SENDS_PER_DAY}.`);
  }
  if (weekCount >= MAX_SENDS_PER_WEEK) {
    reasons.push(`${weekCount} list send(s) in the last 7 days${since}; the cap is ${MAX_SENDS_PER_WEEK}.`);
  }
  const totals = lastWeek.reduce((t, s) => {
    t.delivered += s.delivered;
    t.bounced += s.bounced;
    t.complained += s.complained;
    return t;
  }, { delivered: 0, bounced: 0, complained: 0 });
  const attempted = totals.delivered + totals.bounced;
  const bounceRate = attempted ? totals.bounced / attempted : 0;
  const complaintRate = totals.delivered ? totals.complained / totals.delivered : 0;
  if (bounceRate > MAX_BOUNCE_RATE) {
    reasons.push(`7-day bounce rate ${(bounceRate * 100).toFixed(2)}% is above ${MAX_BOUNCE_RATE * 100}%: run list hygiene first.`);
  }
  if (complaintRate > MAX_COMPLAINT_RATE) {
    reasons.push(`7-day complaint rate ${(complaintRate * 100).toFixed(2)}% is above ${MAX_COMPLAINT_RATE * 100}%: run list hygiene first.`);
  }

  return {
    ok: reasons.length === 0,
    reasons,
    account: summary,
    lastWeek: lastWeek.map(s => `${s.sentAt} ${s.state} "${s.subject}" delivered ${s.delivered}, bounced ${s.bounced}, complained ${s.complained}`),
    rates: {
      bounce: Number(bounceRate.toFixed(4)),
      complaint: Number(complaintRate.toFixed(4))
    }
  };
}
