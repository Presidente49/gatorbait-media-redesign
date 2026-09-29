async function attributionRepair() {
 const APPLY = true; // Root alone may set true after reviewing dry run.
 const plan = [
  {
    "id": "d0567063-f873-407b-a849-81d9c7b19c89",
    "title": "Honor Roll: Baugh, Montgomery and Lovett Collect SEC Weekly Award",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-28T20:56:09.429Z",
    "bylines": [
      "By GatorBait Media Staff"
    ],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "50399e36-c062-445b-af27-5233ea5c9a2c",
    "title": "Pay the Toll: Sumrall Buries the Ole Miss Win, Braces for \u2018Bloody",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-28T20:54:04.859Z",
    "bylines": [
      "By GatorBait Media Staff"
    ],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "bc01aadb-663b-4b07-ae10-492f15977b23",
    "title": "Chris Spears\u2019 Best Shots, Vol. 2: Florida 52, Ole Miss 28",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-28T02:06:47.067Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "67bd8aca-89e2-4098-b934-4c019b4f588e",
    "title": "Chris Spears' Best Shots: Florida 52, Ole Miss 28",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-28T01:49:57.678Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "baa858cf-14b9-465e-b2b8-2368eb0f9926",
    "title": "BREAKING: MRI Confirms Grade 1 PCL Sprain for Gators WR Vernell B",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-27T22:04:07.340Z",
    "bylines": [
      "By GatorBait Staff"
    ],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "db2e38da-bb2b-47c9-b593-d0b8f9e6d173",
    "title": "Show-Me State of Mind: A First Look at No. 25 Missouri",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-27T21:53:54.985Z",
    "bylines": [
      "By GatorBait Media Staff"
    ],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "b03c2ea6-f405-454e-922f-72a30488c1c4",
    "title": "10 Thoughts From the Sidelines: Florida 52, Ole Miss 28",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-27T18:39:36.536Z",
    "bylines": [
      "Column | By Chris Spears, GatorBait Media"
    ],
    "targetMemberId": "41080090-2159-467d-99ee-4737ad4c758d",
    "decision": "READY"
  },
  {
    "id": "c658c408-15f6-4589-85a2-07be31e0ae99",
    "title": "Chomp Up the Charts: Florida Jumps to No. 8 in AP, Coaches Polls",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-27T18:20:18.029Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "9fb69423-fde5-462e-9275-06b99c55fb18",
    "title": "What Happened in College Football Saturday: Gators Take Down No. ",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-27T05:25:16.423Z",
    "bylines": [
      "By GatorBait Media Staff"
    ],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "8d3c0eec-6f6f-4131-a675-39bc08a2a81d",
    "title": "Woods Chipper: Florida\u2019s Defense, Special Teams Swing Win Over No",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-27T01:58:05.731Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "2bb6c273-e733-4af6-bcf7-5b814f768967",
    "title": "\u2018It Ain\u2019t Fully Awake Yet\u2019: Sumrall Says Gators Haven\u2019t Arrived A",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-27T00:44:28Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "e010110a-fd4e-444b-b22b-e894ef6adca1",
    "title": "Commit, Then Rout: Four-Star Safety Cyion Smith Picks Florida Bef",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-27T00:30:27.077Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "94127b93-7c14-42f3-896b-9b99d6d9bc09",
    "title": "Baugh Game: Gators Run Over No. 4 Ole Miss 52-28 in The Swamp",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-26T23:46:39.777Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "bb2287f1-7037-4087-ae9b-34ff7dcfe266",
    "title": "Baugh Punches Ole Miss Twice: Gators Lead 17-6 at the Half",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-26T21:31:19.083Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "d62e1c46-170a-4204-a155-2faf03627a89",
    "title": "Lacy-Less in The Swamp: Ole Miss Star RB Kewan Lacy Ruled Out vs.",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-26T18:14:42.613Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "6ece9e4d-d58f-4fc3-b017-f1578e685142",
    "title": "Louis Oliver Is Today's Mr. Two Bits",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-26T17:22:56Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "e5686337-ed54-42d6-965a-907032eb466d",
    "title": "Baugh Runs the SEC: Florida's Junior Back Leads the League in Eve",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-26T17:21:31Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "270e8172-6330-4d7e-b8e5-5e473f4144c7",
    "title": "It's Game Day in The Swamp: No. 21 Florida vs No. 4 Ole Miss",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-26T17:18:47Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "40e8c3e9-5445-4266-bf40-07aa8e31834e",
    "title": "LIVE NOW: Florida vs Ole Miss Preview on Gator Lowdown",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-23T01:58:16.089Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "064b72aa-54ac-4af4-a8ad-54fc1b019a81",
    "title": "Jon Sumrall: No Bad Wins, Work the Cut After Florida Beats Auburn",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-20T08:14:12.271Z",
    "bylines": [
      "By GatorBait Staff"
    ],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "cf6133a6-5d24-4a76-8344-f6b70614e563",
    "title": "No Bad Wins: Sumrall Issues Warning After Florida's Auburn Win",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-20T07:30:31.107Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "3aeddf16-3d68-429a-8ec5-bef29b225f3d",
    "title": "Florida 44 Auburn 39: Gators End Jordan-Hare Drought",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-20T03:07:30.120Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "8a0c4b1a-cdf2-4b42-93ea-ca6705d055b6",
    "title": "FINAL Florida 44 Auburn 39: Gators Survive 16 Penalties",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-19T23:45:16.645Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "ea8d7ace-8579-4a82-9508-fc7ec5d1d081",
    "title": "Best Friday in Football with Buddy Martin | September 18, 2026",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-18T13:09:17.732Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "aeb4f5a5-3910-4b11-9a63-b05bac96e623",
    "title": "Florida Roster and Injury Watch Ahead of Ole Miss",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-17T23:51:02.332Z",
    "bylines": [
      "By GatorBait Staff"
    ],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "DEFER_TO_ROSTER"
  },
  {
    "id": "a161f341-f5d3-437b-beed-70c6d9d42bb7",
    "title": "Laura Rutledge Returns to The Buddy Martin Show; Carlton Reese Re",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-17T14:44:43.506Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "ff634071-5ee7-4c9f-985a-ba197369733f",
    "title": "Florida at Auburn: Ryan Urquhart Says the Gators Must Embrace the",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-17T14:44:43.181Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "HOLD_EXISTING_UNPUBLISHED_EDITS"
  },
  {
    "id": "168dacda-ed31-4968-b663-09e49e2859aa",
    "title": "WATCH LIVE: The Buddy Martin Show \u2014 Florida Heads to Auburn and t",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-15T01:11:18.726Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "10a6bddb-ce48-428f-81a0-cd2c22e6a190",
    "title": "Florida\u2013Auburn By the Numbers: Two New Coaches, One Old Rivalry",
    "memberId": "16433bab-ee11-4e09-9f6c-cac7a12ec042",
    "date": "2026-09-14T17:15:28.449Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "HOLD_EXISTING_UNPUBLISHED_EDITS"
  },
  {
    "id": "96e490e2-46a4-412d-8246-14c0448ee858",
    "title": "Brown Supplies the Spark as Florida Rolls Past Campbell, 52-3",
    "memberId": "fade11f0-405c-4425-bbab-111e5350dcdb",
    "date": "2026-09-13T20:40:01Z",
    "bylines": [],
    "targetMemberId": "93d9f853-336f-4a8e-bcfa-4c621ff96db9",
    "decision": "READY"
  },
  {
    "id": "1c12e61d-0018-4089-896c-47ab5d470655",
    "memberId": "c6f7996f-a5f3-4b00-ac07-4e883fa9a4b4",
    "decision": "READY",
    "title": "Postgame Analysis"
  },
  {
    "id": "bb1d7484-5c32-433c-b4e6-5760e5433874",
    "memberId": "ae876af8-9478-4613-8f0b-5218ad33fdc9",
    "decision": "READY",
    "title": "The Swamp Gets Its Swagger Back"
  }
];
 const facts = [
  {
    "postId": "d0567063-f873-407b-a849-81d9c7b19c89",
    "title": "Honor Roll",
    "replacements": [
      {
        "before": "It's the first career SEC weekly honor for all three.",
        "after": "It is Baugh\u2019s first SEC Offensive Player of the Week award and the first SEC weekly honor for Montgomery and Lovett.",
        "claimId": "C05"
      },
      {
        "before": "Nov. 11, 2022",
        "after": "Nov. 12, 2022",
        "claimId": "C06"
      }
    ],
    "excerptCandidate": {
      "beforeFromRss": "Jadan Baugh, London Montgomery and Bryce Lovett each won their first SEC weekly honor after Florida's 52-28 win over No. 4 Ole Miss.",
      "after": "Jadan Baugh earned his first SEC Offensive Player of the Week award, while London Montgomery and Bryce Lovett received their first SEC weekly honors after Florida\u2019s 52-28 win over No. 4 Ole Miss.",
      "precondition": "Read and exactly match the native excerpt before mutation; this original was observed in the current RSS description.",
      "claimId": "C05"
    }
  },
  {
    "postId": "1c12e61d-0018-4089-896c-47ab5d470655",
    "title": "Postgame Analysis",
    "replacements": [
      {
        "before": "who joined Emmitt Smith and Fred Taylor as the only Florida back to have four straight 100-yard rushing games in Florida history.",
        "after": "who entered the game with four straight 100-yard rushing games.",
        "claimId": "C10"
      }
    ]
  },
  {
    "postId": "bb1d7484-5c32-433c-b4e6-5760e5433874",
    "title": "The Swamp Gets Its Swagger Back",
    "replacements": [
      {
        "before": "he threw yet another touchdown pass to make it 38-28",
        "after": "he threw a touchdown pass to make it 38-28",
        "claimId": "C11"
      }
    ]
  }
];
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
 const eligible=[];
 for(const item of prepared){
  const {row,d}=item;
  try {
   const fresh=(await wix.request({
    method:'GET',
    url:'https://www.wixapis.com/blog/v3/draft-posts/'+row.id
   })).data?.draftPost;
   if(!fresh || fresh.hasUnpublishedChanges!==false || fresh.editedDate!==d.editedDate || fresh.memberId!==d.memberId)throw Error('Concurrent edit detected');
   eligible.push(item);
  }catch(error){results.push({id:row.id,status:'GUARD_FAILED',error:String(error)});}
 }
 for(let offset=0;offset<eligible.length;offset+=20){
  const batch=eligible.slice(offset,offset+20);
  let bulk;
  try {
   const res=await wix.request({
    method:'PATCH',
    url:'https://www.wixapis.com/blog/v3/draft-posts/update',
    body:{
     draftPosts: batch.map(x => ({
      draftPost: x.body,
      fieldMask: {
       paths: Object.keys(x.body).filter(k => k !== 'id')
      }
     })),
     action:'UPDATE_PUBLISH'
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
    const after=(await wix.request({
     method:'GET',
     url:'https://www.wixapis.com/blog/v3/draft-posts/'+row.id+'?fieldsets=RICH_CONTENT'
    })).data?.draftPost;
    if(after?.memberId!==(body.memberId||d.memberId)||after?.firstPublishedDate!==d.firstPublishedDate||after?.seoSlug!==d.seoSlug||after?.hasUnpublishedChanges!==false)throw Error('Metadata postcheck failed');
    if(body.richContent && JSON.stringify(after.richContent.nodes)!==JSON.stringify(body.richContent.nodes))throw Error('Body postcheck failed');
    if(body.excerpt && after.excerpt!==body.excerpt)throw Error('Excerpt postcheck failed');
    results.push({id:row.id,status:'UPDATED_VERIFIED',memberId:after.memberId,firstPublishedDate:after.firstPublishedDate,seoSlug:after.seoSlug});
   }catch(error){results.push({id:row.id,status:'VERIFY_FAILED',error:String(error),bulkResults:bulk.results,bulkActionMetadata:bulk.bulkActionMetadata});}
  }
 }
 return results;
}
