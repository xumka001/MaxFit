import test from 'node:test';
import assert from 'node:assert/strict';
import { leadSchema, checkoutSchema } from '../lib/validation.ts';
import { readJson, rejectCrossOrigin, submissionKey } from '../lib/server/http.ts';
const lead={name:' Max ',contact:'@client',goal:'Снизить вес',serviceId:'online',consent:true};
test('leads require contact and consent, normalize names and reject extra properties',()=>{
 assert.equal(leadSchema.parse(lead).name,'Max');
 for(const invalid of [{...lead,consent:false},{...lead,contact:''},{...lead,serviceId:'other'},{...lead,website:'spam'},{...lead,price:1}]) assert.equal(leadSchema.safeParse(invalid).success,false);
});
test('checkout accepts only a service, never an amount supplied by the browser',()=>{
 assert.equal(checkoutSchema.safeParse({serviceId:'personal'}).success,true);
 assert.equal(checkoutSchema.safeParse({serviceId:'personal',amount:1}).success,false);
});
test('API enforces origin, content type, body size and submission key',async()=>{
 const request=new Request('https://maxfit.test/api/leads',{method:'POST',headers:{origin:'https://maxfit.test','content-type':'application/json','idempotency-key':'1333b706-7053-4b6f-8e2a-13a770531aac'},body:JSON.stringify(lead)});
 assert.equal(rejectCrossOrigin(request),false);assert.ok(submissionKey(request));assert.deepEqual(await readJson(request),lead);
 assert.equal(rejectCrossOrigin(new Request('https://maxfit.test',{headers:{origin:'https://evil.test'}})),true);
 assert.equal(submissionKey(new Request('https://maxfit.test')),null);
 await assert.rejects(readJson(new Request('https://maxfit.test',{method:'POST',body:'x'.repeat(9000),headers:{'content-type':'application/json'}})));
 await assert.rejects(readJson(new Request('https://maxfit.test',{method:'POST',body:'{}'})));
});
