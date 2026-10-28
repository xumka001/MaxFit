"use client";
import { useEffect, useRef, useState } from 'react';
import { BrandMark, FlowIcon } from './icons';
import { PaymentMark, paymentLabels, type PaymentMethod } from './payment-marks';
export function CheckoutDialog({initialMethod='visa',onClose,onEnquire}:{initialMethod?:PaymentMethod;onClose:()=>void;onEnquire:()=>void}) {
 const ref=useRef<HTMLDialogElement>(null);
 const [method,setMethod]=useState<PaymentMethod>(initialMethod);
 useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close()},[]);
 return <dialog ref={ref} className="checkout-dialog" aria-labelledby="checkout-title" onClose={onClose} onClick={event=>{if(event.target!==event.currentTarget)return;const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.currentTarget.close()}}>
 <button className="close" onClick={()=>ref.current?.close()} aria-label="Закрыть покупку">×</button>
 <div className="checkout-heading"><span className="checkout-symbol"><BrandMark/></span><span className="demo-tag">ПРЕДПРОСМОТР</span></div>
 <p className="eyebrow muted">ТВОЙ СЛЕДУЮЩИЙ УРОВЕНЬ</p><h2 id="checkout-title">Вложись в себя.</h2><p className="checkout-intro">Одна программа. Понятный путь к твоей цели.</p>
 <div className="order-summary"><div className="product-thumbnail"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m10 10 12 12M5 13l8-8m6 22 8-8M3 10l7-7m12 26 7-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg></div><div><h3>Программа тренировок</h3><p>Под твой уровень · зал или дом</p></div></div>
 <div className="checkout-total"><span>Стоимость</span><strong>Уточняется</strong></div>
 <fieldset className="payment-choices"><legend>Как тебе удобнее оплатить?</legend><div>{(['visa','mastercard','crypto'] as const).map(value=><label key={value} className={`payment-choice ${value} ${method===value?'selected':''}`}><input type="radio" name="payment-method" value={value} checked={method===value} onChange={()=>setMethod(value)}/><PaymentMark method={value}/><span className="sr-only">{paymentLabels[value]}</span><span className="choice-check" aria-hidden="true">{method===value?'✓':''}</span></label>)}</div></fieldset>
 <button className="primary checkout-pay" disabled><svg width="15" height="18" viewBox="0 0 16 20" fill="none" aria-hidden="true"><rect x="2" y="8" width="12" height="10" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8V5a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.5"/></svg>Оплата скоро</button>
 <p className="checkout-disclaimer">Это предварительный вид оплаты. Списаний нет, данные карты не запрашиваются.</p>
 <button className="checkout-enquire" onClick={onEnquire}>Узнать стоимость <FlowIcon/></button>
 </dialog>;
}
