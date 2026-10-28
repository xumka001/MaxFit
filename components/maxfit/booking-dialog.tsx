"use client";
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { goals, services, type ServiceId } from '@/lib/catalog';
import { FlowIcon } from './icons';
export function BookingDialog({initialService,onClose}:{initialService:ServiceId|'undecided';onClose:()=>void}) {
 const dialog=useRef<HTMLDialogElement>(null);
 const submissionId=useRef('');
 const [enabled,setEnabled]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [message,setMessage]=useState('');
 const [sent,setSent]=useState(false);
 const [copyStatus,setCopyStatus]=useState('');
 const messageRef=useRef<HTMLTextAreaElement>(null);
 useEffect(()=>{
   const el=dialog.current;
   el?.showModal();
   const bytes=crypto.getRandomValues(new Uint8Array(16));
   bytes[6]=(bytes[6]&15)|64; bytes[8]=(bytes[8]&63)|128;
   const hex=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
   submissionId.current=`${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
   const controller=new AbortController();
   fetch('/api/status',{signal:controller.signal}).then(r=>r.ok?r.json():null).then(data=>{if(data && typeof data === 'object' && 'leadsEnabled' in data)setEnabled(data.leadsEnabled===true)}).catch(()=>{});
   return ()=>{controller.abort();el?.close()};
 },[]);
 async function submit(event:FormEvent<HTMLFormElement>) {
   event.preventDefault();setError('');
   const data=new FormData(event.currentTarget);
   const name=String(data.get('name')||'').trim();
   const serviceId=String(data.get('serviceId'));
   const goal=String(data.get('goal'));
   if(!name){setError('Укажи имя.');return}
   if(!enabled){
     const format=services.find(s=>s.id===serviceId)?.title||'Помоги выбрать';
     setMessage(`Привет! Меня зовут ${name}. Хочу начать тренировки с MaxFit.\nЦель: ${goal}.\nФормат: ${format}.\nРасскажи, пожалуйста, об условиях и стоимости.`);
     return;
   }
   setBusy(true);
   try {
     const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':submissionId.current},body:JSON.stringify({name,goal,serviceId,contact:String(data.get('contact')||'').trim(),consent:data.get('consent')==='on',website:String(data.get('website')||'')})});
     const result=await response.json();
     if(!response.ok)throw new Error(result && typeof result === 'object' && 'error' in result && typeof result.error === 'string' ? result.error : 'Не удалось отправить заявку.');
     setSent(true);
   }catch(e){setError(e instanceof Error?e.message:'Не удалось отправить заявку. Попробуй ещё раз.')}finally{setBusy(false)}
 }
 async function copy(){try{await navigator.clipboard.writeText(message);setCopyStatus('Скопировано. Заявка не отправлена.')}catch{messageRef.current?.select();setCopyStatus('Текст выделен — скопируй его вручную.')}}
 return <dialog ref={dialog} id="booking" aria-labelledby="booking-title" onClose={onClose} onClick={event=>{if(event.target!==event.currentTarget)return;const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.currentTarget.close()}}>
 <button className="close" onClick={()=>dialog.current?.close()} aria-label="Закрыть">×</button>
 <p className="eyebrow muted">НАЧНЁМ СО ЗНАКОМСТВА</p><h2 id="booking-title">Твоя точка старта.</h2>
 {sent?<div role="status"><p>Заявка сохранена. Тренер сможет связаться с тобой по указанному контакту.</p><button className="primary" onClick={()=>dialog.current?.close()}>Готово</button></div>:message?<div id="result"><p>Текст готов. Скопируй его, чтобы передать тренеру.</p><textarea ref={messageRef} value={message} readOnly aria-label="Текст заявки"/><button className="primary" onClick={copy}>Скопировать текст <FlowIcon /></button><p role="status">{copyStatus}</p></div>:<form onSubmit={submit}>
 <label>Как тебя зовут?<input name="name" autoComplete="given-name" required maxLength={60} placeholder="Твоё имя"/></label>
 <label>Твоя цель<select name="goal">{goals.map(goal=><option key={goal}>{goal}</option>)}</select></label>
 <label>Формат<select name="serviceId" defaultValue={initialService}><option value="undecided">Помоги выбрать</option>{services.map(service=><option value={service.id} key={service.id}>{service.title}</option>)}</select></label>
 {enabled&&<><label>Telegram, телефон или email<input name="contact" autoComplete="off" required minLength={3} maxLength={120} placeholder="Как с тобой связаться"/></label><label className="consent"><input type="checkbox" name="consent" required/>Разрешаю использовать мой контакт для ответа на заявку.</label></>}
 <label className="honeypot" aria-hidden="true">Сайт<input name="website" tabIndex={-1} autoComplete="off"/></label>
 {error&&<p className="form-error" role="alert">{error}</p>}
 <button className="primary" type="submit" disabled={busy}>{busy?'Отправляем…':enabled?'Отправить заявку':'Подготовить заявку'}<FlowIcon /></button>
 {!enabled&&<p className="form-note">Запись пока закрыта. Можно подготовить текст заявки и скопировать его — он никуда не отправляется.</p>}
 </form>}
 </dialog>;
}
