/* GatorBait Publication — Wix page adapter
 * Intended for page code on a blank Wix Editor route that contains ONE Custom Element
 * with element ID: #gatorbaitPublication
 * and tag name: gatorbait-publication
 *
 * Wix-hosted custom element source should be copied to:
 * public/custom-elements/gatorbait-publication.js
 *
 * Uses the documented Wix JavaScript SDK for site code. No REST-in-browser calls.
 */

import { posts } from '@wix/blog';

const CONFIG = {
  mode: 'home',          // home | section | magazine | tv
  sectionTitle: '',      // e.g. Florida Football
  categoryIds: [],       // optional Wix Blog category IDs
  limit: 30
};

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function normalizePost(post) {
  return {
    id: post._id,
    title: post.title || '',
    excerpt: post.excerpt || '',
    date: formatDate(post.firstPublishedDate || post.lastPublishedDate),
    url: post.slug ? `/post/${post.slug}` : '/',
    image: post.media?.wixMedia?.image || post.heroImage || '',
    imageAlt: post.title || '',
    categoryIds: Array.isArray(post.categoryIds) ? post.categoryIds : [],
    minutesToRead: post.minutesToRead || null,
    featured: Boolean(post.featured)
  };
}

function matchesConfiguredCategories(post) {
  if (!CONFIG.categoryIds.length) return true;
  return CONFIG.categoryIds.some(id => post.categoryIds.includes(id));
}

$w.onReady(async function () {
  const publication = $w('#gatorbaitPublication');

  publication.setAttribute('mode', CONFIG.mode);
  if (CONFIG.sectionTitle) {
    publication.setAttribute('section-title', CONFIG.sectionTitle);
  }

  if (CONFIG.mode === 'tv') {
    publication.setAttribute('data-json', JSON.stringify({ stories: [] }));
    return;
  }

  try {
    const result = await posts.listPosts({
      paging: { limit: Math.min(CONFIG.limit, 100) }
    });

    const stories = (result.posts || [])
      .map(normalizePost)
      .filter(matchesConfiguredCategories)
      .slice(0, CONFIG.limit);

    publication.setAttribute('data-json', JSON.stringify({ stories }));
  } catch (error) {
    console.error('GatorBait publication feed failed to load.', error);
    publication.setAttribute('data-json', JSON.stringify({ stories: [] }));
  }
});
