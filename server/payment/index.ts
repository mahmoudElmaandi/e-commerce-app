import { StripeGateway } from './stripe/index';
import Stripe from "stripe";

export interface StripePaymentGateway {
    createCustomer(name: string, email: string,): Promise<string> // Return Customer Id
    createCheckoutSession(customerId: string, paymentMode: Stripe.Checkout.SessionCreateParams.Mode, items: Stripe.Checkout.SessionCreateParams.LineItem[], success_url: string, cancel_url: string): Promise<string>
    createPaymentIntent(customerId: string, amount: number, currency: string): Promise<Stripe.PaymentIntent>
    verifySessionEvent(payload: Buffer, sig: string): Stripe.Event
};

export let stripeGateway: StripePaymentGateway;

export async function initPaymentGateway(sk: string, webHookSecret: string) {
    stripeGateway = new StripeGateway(sk, webHookSecret);
}