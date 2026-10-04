import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { DeskError,mayRead } from './domain';
export const runtime=()=>env as unknown as {DB:D1Database,BUCKET:R2Bucket,OWNER_EMAIL?:string};
export function db(){if(!runtime().DB)throw new DeskError('The desk is temporarily unavailable. Your unsaved text is still here.',503);return runtime().DB;}
export async function staffUser(){const user=await getChatGPTUser();if(!user)throw new DeskError('Please sign in to open the Writers’ Desk.',401);const staff=await db().prepare('SELECT * FROM staff WHERE user_id = ? AND active = 1').bind(user.userId).first<any>();if(!staff)throw new DeskError('Your account needs approval from the publisher.',403);return staff;}
export async function setupUser(){const user=await getChatGPTUser();if(!user)throw new DeskError('Please sign in first.',401);const email=user.email.toLowerCase();const owner=runtime().OWNER_EMAIL?.toLowerCase();if(owner&&email===owner)await db().prepare("INSERT OR IGNORE INTO staff(email,user_id,name,role,active,title) VALUES(?,?,?,'editor',1,'Publisher')").bind(email,user.userId,user.fullName||'Brenden Martin').run();await db().prepare('UPDATE staff SET user_id = ? WHERE email = ? AND user_id IS NULL AND active = 1').bind(user.userId,email).run();return staffUser();}
export async function storyFor(staff:any,id:string){const s=await db().prepare('SELECT * FROM stories WHERE id = ?').bind(id).first<any>();if(!s||!mayRead(staff,s))throw new DeskError('Story not found.',404);return s;}
export function origin(request:Request){if(request.headers.get('origin')!==new URL(request.url).origin)throw new DeskError('Please make this change from the Writers’ Desk.',403);}
export async function jsonInput(request:Request){origin(request);if(Number(request.headers.get('content-length')||0)>1000000)throw new DeskError('This submission is too large.',413);const raw=await request.text();if(raw.length>1000000)throw new DeskError('This submission is too large.',413);try{return JSON.parse(raw)}catch{throw new DeskError('Please check your submission.');}}
export function ok(value:unknown,status=200){return Response.json(value,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})}
export function fail(e:unknown){if(e instanceof DeskError)return ok({error:e.message},e.status);console.error('Desk request failed',e instanceof Error?e.message:'unknown');return ok({error:'The desk could not save that change. Your text is still here. Please try again.'},503)}
export const id=()=>crypto.randomUUID();
export const now=()=>new Date().toISOString();
