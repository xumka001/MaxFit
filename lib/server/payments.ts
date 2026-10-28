import type { ServiceId } from '../catalog';
export type CheckoutSession = { id: string; url: string };
export interface PaymentProvider {
  // Implement on the server: map serviceId to a trusted provider price ID.
  // Never accept an amount or redirect URL from the browser.
  createCheckout(serviceId: ServiceId, idempotencyKey: string): Promise<CheckoutSession>;
}
export function getPaymentProvider(): PaymentProvider | null {
  // Attach Stripe / another provider here after merchant account configuration.
  // Null is intentional: the API must not simulate a successful payment.
  return null;
}
