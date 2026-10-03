// Private Writers' Desk domain service. All persistence/media adapters are server-only.
// This module has no publish, email, payment or public-media operation.
export class DeskError extends Error { constructor(code){ super(code);this.code=code; } }
const deny=()=>{throw new DeskError('NOT_AUTHORIZED')};
function text(value,max,required=true){if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw new DeskError('INVALID_INPUT');return value.trim()}
const formats=new Map([['image/jpeg',25e6],['image/png',25e6],['image/webp',25e6],['video/mp4',500e6],['video/quicktime',500e6],['audio/mpeg',100e6],['audio/mp4',100e6],['audio/wav',100e6],['application/pdf',25e6]]);
export function createDesk({identity,store,media,randomId,now=()=>new Date().toISOString()}) {
  async function actor(){
    const member=await identity.currentMember();if(!member?.id)deny();
    const staff=await store.staff(member.id);
    if(!staff?.active||!['writer','editor'].includes(staff.role))deny();
    return {id:member.id,name:staff.name,role:staff.role};
  }
  async function storyFor(a,id){const s=await store.getStory(text(id,100));if(!s||(s.authorId!==a.id&&a.role!=='editor'))deny();return s}
  async function append(a,s,input,expectedRevision){
    if(!Number.isSafeInteger(expectedRevision)||expectedRevision!==s.revision)throw new DeskError('CONFLICT');
    // Adapter must use an atomic compare-and-swap/transaction, never read+overwrite.
    return store.appendEvent(s.id,s.revision,{...input,id:randomId(),actorId:a.id,actorName:a.name,at:now()});
  }
  return {
    async home(){const a=await actor();return {me:{name:a.name,role:a.role},stories:await store.listStories(a.role==='editor'?null:a.id),capabilities:{privateUploads:!!media?.verifiedPrivateStorage,ai:false,readerInbox:false}}},
    async create(input){const a=await actor();const title=text(input.title,180);const body=text(input.body,100000,false);return store.createStory({id:randomId(),authorId:a.id,authorName:a.name,title,body,status:'draft',revision:0,createdAt:now()})},
    async read(id){const a=await actor();const s=await storyFor(a,id);return {...s,events:await store.events(s.id)}},
    async save(id,input,revision){const a=await actor();const s=await storyFor(a,id);if(!['draft','changes_requested'].includes(s.status))throw new DeskError('READ_ONLY_STATUS');return append(a,s,{type:'save',title:text(input.title,180),body:text(input.body,100000,false)},revision)},
    async submit(id,revision){const a=await actor();const s=await storyFor(a,id);if(!['draft','changes_requested'].includes(s.status)||!s.body.trim())throw new DeskError('NOT_READY');return append(a,s,{type:'submit'},revision)},
    async reply(id,message,revision){const a=await actor();const s=await storyFor(a,id);return append(a,s,{type:'reply',message:text(message,10000)},revision)},
    async requestChanges(id,message,revision){const a=await actor();if(a.role!=='editor')deny();const s=await storyFor(a,id);if(s.status!=='submitted')throw new DeskError('NOT_READY');return append(a,s,{type:'changes_requested',message:text(message,10000)},revision)},
    async question(id,message,revision){const a=await actor();const s=await storyFor(a,id);return append(a,s,{type:'research_question',message:text(message,10000),state:'awaiting_editor'},revision)},
    async upload(id,input){
      const a=await actor();await storyFor(a,id);
      if(!media?.verifiedPrivateStorage)throw new DeskError('PRIVATE_UPLOADS_NOT_CONNECTED');
      const name=text(input.name,180),caption=text(input.caption,1000),credit=text(input.credit,180);
      const limit=formats.get(input.mime);if(!limit||!Number.isSafeInteger(input.size)||input.size<1||input.size>limit||input.rightsConfirmed!==true)throw new DeskError('INVALID_MEDIA');
      const ticket={id:randomId(),storyId:id,actorId:a.id,name,mime:input.mime,size:input.size,caption,credit,createdAt:now()};
      // Adapter reserves a private object, binds exact type/size, short expiry,
      // and stores ticket->object mapping server-side. Never accepts arbitrary URLs.
      return media.reservePrivateUpload(ticket);
    },
    async finishUpload(id,ticketId,revision){
      const a=await actor();const s=await storyFor(a,id);
      if(!media?.verifiedPrivateStorage)throw new DeskError('PRIVATE_UPLOADS_NOT_CONNECTED');
      const file=await media.inspectTicket(text(ticketId,100));
      if(!file||file.actorId!==a.id||file.storyId!==id||file.private!==true||file.state!=='clean'||file.actualSize!==file.size||file.detectedMime!==file.mime||file.expired||file.attached)throw new DeskError('MEDIA_NOT_READY');
      // Atomic finalize ties attachment and story revision together, prevents replay.
      return store.attachMedia(s.id,revision,{...file,attachedBy:a.id,at:now()});
    },
    async download(id,fileId){const a=await actor();await storyFor(a,id);if(!media?.verifiedPrivateStorage)throw new DeskError('PRIVATE_UPLOADS_NOT_CONNECTED');const f=await store.getAttachment(id,text(fileId,100));if(!f||!f.private)deny();return media.shortLivedDownload(f.objectId)}
  };
}
