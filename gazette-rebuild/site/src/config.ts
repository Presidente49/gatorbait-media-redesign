// GatorBait overlay for the pinned original Gazette theme. Wix business links stay external.
export const site = {
  name: 'GatorBait Magazine',
  description: 'Independent Florida Gators journalism since 1979. Stories, columns and perspective from GatorBait Media.',
  url: 'https://presidente49.github.io',
  locale: 'en',
  author: 'GatorBait Staff',
  email: 'info@gatorbaitmedia.com',
  defaultOgImage: '/gatorbait-logo.webp',
} as const;
export const nav = {
  header: [
    { label: 'This edition', href: '/' },
    { label: 'Editions', href: '/issues' },
    { label: 'GatorBait TV', href: 'https://www.gatorbaitmedia.com/the-buddy-martin-show' },
    { label: 'Store', href: 'https://gatorbait2026.itemorder.com/shop/home/' },
    { label: 'Join', href: 'https://www.gatorbaitmedia.com/pricing-plans' },
    { label: 'Account', href: 'https://www.gatorbaitmedia.com/account/my-account' },
  ],
  footer: [{ title: 'GatorBait', links: [
    { label: 'Latest news', href: 'https://www.gatorbaitmedia.com/' },
    { label: 'Our publication', href: '/about' },
    { label: 'Store', href: 'https://gatorbait2026.itemorder.com/shop/home/' },
    { label: 'Join', href: 'https://www.gatorbaitmedia.com/pricing-plans' },
    { label: 'Contact', href: 'https://www.gatorbaitmedia.com/contact' },
    { label: 'Privacy and terms', href: 'https://www.gatorbaitmedia.com/policies' },
  ] }],
  social: [
    { label: 'YouTube', href: 'https://www.youtube.com/@GatorBaitMedia', icon: 'lucide:youtube' },
    { label: 'Facebook', href: 'https://www.facebook.com/gatorbaitmedia', icon: 'lucide:facebook' },
  ],
} as const;
export const seo = { titleTemplate: '%s · GatorBait Magazine Preview', twitterHandle: '', jsonLd: { type: 'Organization' as 'Person' | 'Organization', name: site.name } };
export const contents = { style: 'leaders' as 'leaders' | 'plain', numbering: true };
export const issues = { articlesPerIssue: 7, showFolio: true, dropCap: false };
export const archive = { issuesPerPage: 12, showReadingTime: false };
export const features = { darkMode: false };
export const analytics = { provider: null as null | 'plausible' | 'ga4' | 'umami', id: '', host: '' };
