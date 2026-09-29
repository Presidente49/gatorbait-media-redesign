import json,pathlib
p=pathlib.Path(__file__).parent
plan=json.loads((p/'native-plan.json').read_text())
facts=json.loads((p.parent/'editorial-factcheck/corrections.json').read_text())
for row in facts:
 if row['postId']!='d0567063-f873-407b-a849-81d9c7b19c89':
  plan.append({'id':row['postId'],'memberId':{'1c12e61d-0018-4089-896c-47ab5d470655':'c6f7996f-a5f3-4b00-ac07-4e883fa9a4b4','bb1d7484-5c32-433c-b4e6-5760e5433874':'ae876af8-9478-4613-8f0b-5218ad33fdc9'}[row['postId']],'decision':'READY','title':row['title']})
script='''async function attributionRepair() {
 const APPLY = false; // Root alone may set true after reviewing dry run.
 const plan = PLAN;
 const facts = FACTS;
 function leaves(n,out=[]){if(n.textData && typeof n.textData.text==='string')out.push(n);for(const c of n.nodes||[])leaves(c,out);return out;}
 function replaceExact(rich,before,after){
  const matches=leaves(rich).filter(n=>n.textData.text.includes(before));
  const count=matches.reduce((a,n)=>a+n.textData.text.split(before).length-1,0);
  if(count!==1)throw Error('Exact text guard failed: '+before+' matches='+count);
  matches[0].textData.text=matches[0].textData.text.replace(before,after);
 }
 const prepared=[], results=[];
 for(const row of plan){
  if(row.decision!=='READY'){results.push({id:row.id,status:row.decision});continue;}
  try {
  const r=await wix.request({
   method:'GET',
   url:'https://www.wixapis.com/blog/v3/draft-posts/'+row.id+'?fieldsets=RICH_CONTENT'
  });
  const d=r.data?.draftPost;
  if(r.status!==200 || !d || d.status!=='PUBLISHED' || d.hasUnpublishedChanges!==false || d.memberId!==row.memberId)throw Error('Draft guard failed '+row.id);
  const body={id:row.id};if(row.targetMemberId)body.memberId=row.targetMemberId;
  const rich=JSON.parse(JSON.stringify(d.richContent));let bodyChanged=false;
  if(row.targetMemberId==='93d9f853-336f-4a8e-bcfa-4c621ff96db9'){
   for(const n of rich.nodes||[]){const ls=leaves(n),s=ls.map(x=>x.textData.text).join('');
    if(/^By GatorBait(?: Media)? ?(?:Magazine)? ?Staff$/i.test(s.trim())){
     if(ls.length!==1)throw Error('Split byline needs explicit patch '+row.id);
     ls[0].textData.text='By Brenden Martin';bodyChanged=true;
    }
   }
  }
  const correction=facts.find(x=>x.postId===row.id);
  for(const x of correction?.replacements||[]){replaceExact(rich,x.before,x.after);bodyChanged=true;}
  if(row.id==='d0567063-f873-407b-a849-81d9c7b19c89'){
   const before="Jadan Baugh, London Montgomery and Bryce Lovett each won their first SEC weekly honor after Florida's 52-28 win over No. 4 Ole Miss.";
   if(d.excerpt!==before)throw Error('Honor Roll excerpt guard failed');
   body.excerpt='Jadan Baugh earned his first SEC Offensive Player of the Week award, while London Montgomery and Bryce Lovett received their first SEC weekly honors after Florida’s 52-28 win over No. 4 Ole Miss.';
  }
  if(bodyChanged)body.richContent=rich;
  prepared.push({row,d,body});
  }catch(error){results.push({id:row.id,status:'PREFLIGHT_FAILED',error:String(error)});}
 }
 if(!APPLY)return {mode:'DRY_RUN',ready:prepared.map(x=>({id:x.row.id,title:x.d.title,from:x.d.memberId,to:x.body.memberId||x.d.memberId,editedDate:x.d.editedDate,fields:Object.keys(x.body)})),held:results};
 for(let offset=0;offset<prepared.length;offset+=20){
 const batch=[];
 for(const item of prepared.slice(offset,offset+20)){
  const {row,d}=item;
  try {
   const fresh=(await wix.request({
    method:'GET',
    url:'https://www.wixapis.com/blog/v3/draft-posts/'+row.id
   })).data?.draftPost;
   if(!fresh || fresh.hasUnpublishedChanges!==false || fresh.editedDate!==d.editedDate || fresh.memberId!==d.memberId)throw Error('Concurrent edit detected');
   batch.push(item);
  }catch(error){results.push({id:row.id,status:'GUARD_FAILED',error:String(error)});}
 }
  if(!batch.length)continue;
  let bulk;
  try {
   const res=await wix.request({
    method:'PATCH',
    url:'https://www.wixapis.com/blog/v3/draft-posts/update',
    body:{
     draftPosts:batch.map(x=>({
      draftPost:x.body,
      fieldMask:{
       paths:Object.keys(x.body).filter(k=>k!=='id')
      }
     })),
     action:'UPDATE_PUBLISH',
     returnFullEntity:true,
     fieldsets:['RICH_CONTENT']
    }
   });
   if(res.status<200||res.status>=300)throw Error('Bulk HTTP '+res.status+' '+JSON.stringify(res.data));
   bulk=res.data;
  }catch(error){
   for(const {row} of batch)results.push({id:row.id,status:'BULK_REQUEST_FAILED_OR_UNCERTAIN',error:String(error)});
   continue;
  }
  for(const {row,d,body} of batch){
   try {
    const result=(bulk.results||[]).find(x=>x.item?.id===row.id);
    const after=result?.item;
    if(!after)throw Error('No returned full entity; inspect bulk per-item results');
    if(after?.memberId!==(body.memberId||d.memberId)||after?.firstPublishedDate!==d.firstPublishedDate||after?.seoSlug!==d.seoSlug||after?.hasUnpublishedChanges!==false)throw Error('Metadata postcheck failed');
    if(body.richContent && JSON.stringify(after.richContent.nodes)!==JSON.stringify(body.richContent.nodes))throw Error('Body postcheck failed');
    if(body.excerpt && after.excerpt!==body.excerpt)throw Error('Excerpt postcheck failed');
    results.push({id:row.id,status:'UPDATED_VERIFIED',memberId:after.memberId,firstPublishedDate:after.firstPublishedDate,seoSlug:after.seoSlug});
   }catch(error){results.push({id:row.id,status:'VERIFY_FAILED',error:String(error),bulkResults:bulk.results,bulkActionMetadata:bulk.bulkActionMetadata});}
  }
 }
 return results;
}'''.replace('PLAN',json.dumps(plan,indent=2)).replace('FACTS',json.dumps(facts,indent=2))
(p/'execute-native.js').write_text(script)
