# The Divorce Club: GoHighLevel Implementation Playbook

This playbook outlines the exact step-by-step process for building out "The Divorce Club" ecosystem within GoHighLevel (GHL). This setup will handle lead capture, community management, event ticketing, and the automated funnel to MarketingMama.com.

## 1. Sub-Account Setup & Branding
Create a dedicated sub-account in your GHL agency dashboard for "The Divorce Club" to keep the CRM and assets isolated from your other brands.

*   **Business Name:** The Divorce Club
*   **Domain Setup:** Connect your custom domain (e.g., `join.thedivorceclub.com` or `events.thedivorceclub.com`).
*   **Brand Assets:** Upload the new "Divorce Club" logo (DC monogram) and set the brand colors (Black `#000000`, Hot Pink/Magenta `#FF007F`, White `#FFFFFF`).
*   **Integrations:** Connect the newly created Instagram account, Facebook Page, and Stripe/PayPal for event ticketing and community subscriptions.

## 2. The CRM Pipeline (The "Fresh Start" Journey)
Set up a custom pipeline in the **Opportunities** tab to track members from initial interest to active community participants and eventually, MarketingMama clients.

**Pipeline Stages:**
1.  **Curious (Lead):** Opted into the waitlist or downloaded a free resource.
2.  **Event RSVP:** Purchased a ticket or RSVP'd to an upcoming local event.
3.  **Attended Event:** Checked in at the physical event.
4.  **Community Member:** Subscribed to the paid online community.
5.  **Rebrand Ready (MarketingMama Lead):** Expressed interest in rebranding their real estate business post-divorce.

## 3. Funnels & Landing Pages
Build the following funnels using the GHL Funnel Builder. Use the dark, grungy nightclub aesthetic with neon pink accents.

### Funnel 1: The Waitlist / Lead Magnet
*   **Purpose:** Capture emails before the official launch or before the first event.
*   **Headline:** "The club you never wanted to join, but won't want to leave."
*   **Call to Action (CTA):** "Get on the List" (Captures Name, Email, Phone, and a custom field: "Are you a real estate professional? Yes/No").
*   **Thank You Page:** "First rule of Divorce Club: Tell everyone about Divorce Club. Follow us on Instagram while you wait."

### Funnel 2: Event Registration
*   **Purpose:** Sell tickets or manage RSVPs for the monthly in-person meetups.
*   **Design:** Use the "Event Teaser" graphics. Include a countdown timer.
*   **Checkout:** Two-step order form. Order bump: "Pre-order the 'Where Exes Become Experts' Book."
*   **Thank You Page:** QR code for event check-in and a link to join the private community.

## 4. Automation Workflows (Workflows Tab)
These automations are the engine of The Divorce Club, ensuring no lead falls through the cracks and seamlessly bridging the gap to MarketingMama.

### Workflow 1: The Welcome Sequence (Trigger: Waitlist Opt-in)
*   **Email 1 (Immediate):** "Welcome to the Club." Tone: Empathetic but edgy. "You survived the worst part. Now comes the fun part."
*   **Email 2 (Day 3):** "Why we built this for Realtors." Explain the unique pressure of selling homes while your own home life is falling apart.
*   **Email 3 (Day 7):** "The Podcast is Live." Link to the first episode of *Uncoupled & Unstoppable*.
*   **SMS (Day 10):** "Hey [Name], our first local event is dropping next week. Keep an eye on your inbox. 🍸 - The Divorce Club"

### Workflow 2: Event Reminder & Follow-up (Trigger: Event RSVP)
*   **Immediate:** Confirmation email with calendar invite.
*   **24 Hours Before:** SMS reminder. "See you tomorrow at [Venue]. First round is on us."
*   **2 Hours Before:** SMS reminder with parking/venue details.
*   **24 Hours After (If Attended):** "Great seeing you. Keep the momentum going—join the private online community." (Moves them to 'Attended Event' pipeline stage).

### Workflow 3: The MarketingMama Bridge (Trigger: Tag added 'Needs Rebrand')
*   *Note: This tag is added manually by you after talking to them at an event, or automatically if they click a specific link in an email.*
*   **Email 1:** "Starting over means a new brand." Discuss the importance of updating headshots, changing names on marketing materials, and launching a solo real estate identity.
*   **Email 2:** "Meet MarketingMama." Introduce your agency as the premier solution for real estate rebranding. Include a link to book a discovery call on the MarketingMama calendar.

## 5. The Community (GHL Communities Feature)
Instead of using Skool or Facebook Groups, utilize GoHighLevel's built-in **Communities** feature to keep everything under one roof.

*   **Setup:** Create a new group called "The Divorce Club: Inner Circle."
*   **Pricing:** Set up a recurring monthly subscription via Stripe within GHL.
*   **Channels/Topics:**
    *   *The Vent Room* (Safe space to complain)
    *   *Referral Network* (Real estate referrals across different markets)
    *   *Rebranding & Business* (Tips for solo agents, subtle MarketingMama integration)
    *   *Event Updates* (Details on local meetups)

## 6. Social Media Planner
Use the GHL **Social Planner** to schedule the 4-week content calendar provided in the `social-media-content-plan.md` document.

*   Connect the Instagram and Facebook accounts.
*   Upload the generated graphics.
*   Copy and paste the captions and hashtags.
*   Schedule the posts according to the Week 1-4 timeline to ensure consistent, automated posting while you focus on building the community.
