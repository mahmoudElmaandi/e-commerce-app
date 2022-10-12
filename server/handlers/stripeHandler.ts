import { createPaymentIntentResponse } from './../../shared/src/api';
import { ExpressHandler } from './../types';
import { createCheckoutSessionRequest, createCheckoutSessionResponse, createPaymentIntentRequest } from "@ecommerce/shared";
import Stripe from "stripe";
import { Datastore } from "../datastore";
import { StripePaymentGateway } from "../payment";

export class StripeHandler {
    private stripeClient: StripePaymentGateway;
    private db: Datastore;

    constructor(db: Datastore, paymentGateway: StripePaymentGateway) {
        this.db = db;
        this.stripeClient = paymentGateway;
    }

    // https://stripe.com/docs/payments/quickstart
    public createPaymentIntent: ExpressHandler<createPaymentIntentRequest, createPaymentIntentResponse> = async (req, res) => {

        // get user stripe id
        const stripeID = await this.db.getUserStripeID(res.locals.userId)

        // Get cart items total amount 
        const total = await this.db.calculateOrderAmount(res.locals.cartId)

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await this.stripeClient.createPaymentIntent(stripeID, total * 100, 'usd')

        res.send({ clientSecret: paymentIntent.client_secret! });
    };

    // https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items
    public createCheckoutSession: ExpressHandler<createCheckoutSessionRequest, createCheckoutSessionResponse> = async (req, res) => {
        let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

        let { success_url, cancel_url } = req.body;

        //Get items form db, not form the user.
        const { items } = await this.db.listCartItems(res.locals.cartId)
        items?.map(item => {
            let lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {};
            lineItem.quantity = item.quantity;
            lineItem.price_data = {
                currency: 'usd', unit_amount: item.price as number * 100, product_data: { name: item.name, images: [item.image] }
            }
            lineItems.push(lineItem)
        });

        const stripeID = await this.db.getUserStripeID(res.locals.userId)
        const sessionUrl = await this.stripeClient.createCheckoutSession(stripeID, 'payment', lineItems, success_url!, cancel_url!)
        res.send({ sessionUrl });
    }

    public handleCheckoutSessionEvents: ExpressHandler<Partial<Buffer>, any> = async (req, res) => {
        const payload = req.body;
        const sig = req.headers['stripe-signature'];

        let event: Stripe.Event;

        try {
            event = this.stripeClient.verifySessionEvent(payload as Buffer, sig as string);
            console.log("coming event", event.type)
            console.log("Verified", event.type)
        } catch (err) {
            console.log("error", (err as Error).message)
            return res.status(400).send({ error: (err as Error).message });
        }

        let userId, cartId;

        switch (event.type) {
            // Handle the checkout.session.completed event
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                // Check the payment status of the Checkout Session || https://stripe.com/docs/payments/checkout/fulfill-orders#delayed-notification
                if (session.payment_status == 'no_payment_required') break
                if (session.payment_status == 'unpaid') break

                // The payment funds are paid and available.

                // get userId and cartID 
                userId = await this.db.getUserIdByStripeId(session.customer as string);
                cartId = await this.db.getUserCartId(userId)

                // Fulfill the purchase...
                // Saving a copy of the order in database || Delete temporary cart items || update Products Stock
                await this.db.fulfillOrder(userId, cartId, session.amount_total as number / 100)
                break;

            // https://stripe.com/docs/payments/payment-intents/verifying-status#webhooks
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                userId = await this.db.getUserIdByStripeId(paymentIntent.customer as string);
                cartId = await this.db.getUserCartId(userId)

                await this.db.fulfillOrder(userId, cartId, paymentIntent.amount as number / 100)
                break;
        }

        res.send({ completed: true });
    }

}