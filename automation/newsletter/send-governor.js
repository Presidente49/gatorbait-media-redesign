async () => {
  // GatorBait send governor. Paste this whole file into ExecuteWixAPI (site
  // 18fb3a4e-d7f6-414a-aeb9-3047db3ea115, hasMutations false) before ANY list
  // email: a campaign, a breaking email, a newsletter, or switching an email
  // automation on. Send only when it returns ok: true.
  // Brenden removed daily/weekly volume caps on Nov. 27, 2026. Counts below are
  // telemetry only; account, automation and list-health gates remain in force.
  // Scope and exact owner quote: docs/EMAIL-VOLUME-POLICY-2026-11-27.md.
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

  // 3. Recent volume telemetry and list health, from published campaigns.
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
  // Retain scheduled campaigns in the recent-activity report as before.
  const within = ms => sends.filter(s => s.state === "SCHEDULED" || now - Date.parse(s.sentAt) < ms);
  const lastWeek = within(7 * DAY_MS);
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
    volume: {
      policyAsOf: "2026-11-27",
      perDayCap: null,
      perWeekCap: null,
      last24h: within(DAY_MS).length,
      last7d: lastWeek.length
    },
    lastWeek: lastWeek.map(s => `${s.sentAt} ${s.state} "${s.subject}" delivered ${s.delivered}, bounced ${s.bounced}, complained ${s.complained}`),
    rates: {
      bounce: Number(bounceRate.toFixed(4)),
      complaint: Number(complaintRate.toFixed(4))
    }
  };
}
