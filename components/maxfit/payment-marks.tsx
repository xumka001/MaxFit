export type PaymentMethod = 'visa' | 'mastercard' | 'crypto';
export const paymentLabels: Record<PaymentMethod,string> = { visa:'Visa', mastercard:'Mastercard', crypto:'Crypto' };
export function PaymentMark({method}:{method:PaymentMethod}) {
 if(method==='mastercard')return <svg viewBox="0 0 100 48" aria-hidden="true"><circle cx="38" cy="20" r="15" fill="#ff4668"/><circle cx="60" cy="20" r="15" fill="#ffbd4b" fillOpacity=".9"/><text x="49" y="46" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="Arial,sans-serif" letterSpacing=".5">mastercard</text></svg>;
 if(method==='visa')return <svg viewBox="0 0 100 48" aria-hidden="true"><text x="50" y="33" textAnchor="middle" fill="currentColor" fontFamily="Arial,sans-serif" fontSize="34" fontStyle="italic" fontWeight="900" letterSpacing="-2">VISA</text></svg>;
 return <svg viewBox="0 0 100 48" aria-hidden="true"><path d="m24 7 11 6v13l-11 6-11-6V13Z" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M21 14h5c6 0 6 6 0 6h-5m0 0h6c6 0 6 6 0 6h-6V14Zm2-3v3m4-3v3m-4 12v3m4-3v3" stroke="currentColor" strokeWidth="1.5" fill="none"/><text x="43" y="26" fill="currentColor" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700">crypto</text></svg>;
}
export function PaymentFooter({onChoose}:{onChoose:(method:PaymentMethod)=>void}) {
 return <div className="payment-footer"><span className="payment-caption">Способы оплаты <span>· скоро</span></span><div className="payment-badges">{(['mastercard','visa','crypto'] as const).map(method=><button key={method} className={`payment-badge ${method}`} onClick={()=>onChoose(method)} aria-label={`${paymentLabels[method]} — посмотреть способ оплаты`}><PaymentMark method={method}/></button>)}</div></div>;
}
