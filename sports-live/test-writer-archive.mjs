import { test } from 'node:test';
import assert from 'node:assert/strict';
import {buildWriterArchive, renderWriterArchive, canonicalStory} from './lib/writer-archive.mjs';
const make = () => ({writer:{name:'Eddie Gilley',kind:'person'},complete:true,windowLabel:'Synthetic QA window — not a live archive',expectedUrls:['/post/one','/post/two'],posts:[
  {title:'Older fixture',url:'/post/one',visibleAuthor:'Eddie Gilley',creditVerified:true,creditEvidence:'synthetic fixture',firstPublishedDate:'2026-09-25T12:00:00Z'},
  {title:'Newer fixture',url:'/post/two',visibleAuthor:'Eddie Gilley',creditVerified:true,creditEvidence:'synthetic fixture',firstPublishedDate:'2026-09-28T12:00:00Z'}]});
test('complete archive is newest first with native canonical anchors',()=>{
  const result=buildWriterArchive(make());assert.equal(result.entries[0].title,'Newer fixture');
  const html=renderWriterArchive(result);assert.match(html,/href="https:\/\/www.gatorbaitmedia.com\/post\/two"/);assert.match(html,/gatorbaitmedia.com<\/a>/);assert.doesNotMatch(html,/script|portrait|biography/);
});
test('incomplete tag set cannot masquerade as writer archive',()=>{const d=make();d.posts.pop();assert.throws(()=>buildWriterArchive(d),/1 missing/)});
test('publisher identity never overrides actual byline',()=>{const d=make();d.posts[0].memberId='eddie-member';d.posts[0].visibleAuthor='Franz Beard';assert.throws(()=>buildWriterArchive(d),/authorship/)});
test('unverified credit fails closed',()=>{const d=make();d.posts[0].creditVerified=false;assert.throws(()=>buildWriterArchive(d),/authorship/)});
test('staff receives no personal archive',()=>{const d=make();d.writer.name='GatorBait Staff';assert.throws(()=>buildWriterArchive(d),/staff links/)});
test('duplicate canonical variants fail',()=>{const d=make();d.posts[1].url='/post/one?utm_source=x';assert.throws(()=>buildWriterArchive(d),/duplicate/)});
test('unknown coverage is not complete',()=>{const d=make();d.complete=false;assert.throws(()=>buildWriterArchive(d),/complete/)});
test('unsafe URLs rejected',()=>{for(const u of ['javascript:alert(1)','https://evil.test/post/one','https://user@gatorbaitmedia.com/post/one'])assert.equal(canonicalStory(u),null)});
test('text escaped and photo without credit omitted',()=>{const d=make();d.posts[0].title='<script>x</script>';d.posts[0].image={src:'https://static.wixstatic.com/media/photo.jpg',alt:'Photo'};const html=renderWriterArchive(buildWriterArchive(d));assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<img/)});
test('more than 12 stories use native disclosure, not hidden JS-only links',()=>{const d=make();d.posts=Array.from({length:13},(_,i)=>({...d.posts[0],url:`/post/story-${i}`}));d.expectedUrls=d.posts.map(p=>p.url);const html=renderWriterArchive(buildWriterArchive(d));assert.match(html,/<details>/);assert.equal((html.match(/class="wa-card"/g)||[]).length,13)});
