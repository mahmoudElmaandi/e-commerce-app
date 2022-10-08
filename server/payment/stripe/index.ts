import { StripePaymentGateway } from './../index';
import Stripe from "stripe";

export class StripeGateway implements StripePaymentGateway {

    private stripeClinet: Stripe;

    constructor(sk: string) {
        this.stripeClinet = new Stripe(sk, {
            apiVersion: "2022-08-01",
            typescript: true
        })
    }

    async createCustomer(name: string, email: string,): Promise<string> {
        const customer = await this.stripeClinet.customers.create({
            name, email
        })
        return customer.id
    }

    async createCheckoutSession(customerId: string, paymentMode: Stripe.Checkout.SessionCreateParams.Mode, items: Stripe.Checkout.SessionCreateParams.LineItem[], success_url: string, cancel_url: string): Promise<string> {
        const session = await this.stripeClinet.checkout.sessions.create({
            line_items: items,
            mode: paymentMode,// 'payment'
            success_url,
            cancel_url,
            // shipping_address_collection: {
            //     allowed_countries: ['EG']
            // },
            customer: customerId
        });

        return session.url as string;
    }

    verifySessionEvent(payload: Buffer, sig: string, endpointSecret: string): Stripe.Event {
        return this.stripeClinet.webhooks.constructEvent(payload, sig, endpointSecret)
    }

    async createPaymentIntent(customerId: string, amount: number, currency: string): Promise<Stripe.PaymentIntent> {
        return await this.stripeClinet.paymentIntents.create({
            customer: customerId, amount, currency,
        })
    }

}