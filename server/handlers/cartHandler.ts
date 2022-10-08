import { StripePaymentGateway } from './../payment/index';
import { AddCartItemRequest, AddCartItemResponse, CartItem, ERRORS, ListCartItemsRequest, ListCartItemsResponse, deleteCartItemRequest, deleteCartItemResponse, updateCartItemQuantityRequest, updateCartItemQuantityResponse, createCheckoutSessionRequest, createCheckoutSessionResponse } from '@ecommerce/shared';
import { Datastore } from '../datastore';
import { ExpressHandler } from './../types';
import Stripe from 'stripe';

export class CartHandler {
    private db: Datastore;
    private stripeClient: StripePaymentGateway;

    constructor(db: Datastore, paymentGateway: StripePaymentGateway) {
        this.db = db;
        this.stripeClient = paymentGateway;
    }

    public listCartItems: ExpressHandler<ListCartItemsRequest, ListCartItemsResponse> = async (req, res) => {
        const productCartItemsObj = await this.db.listCartItems(res.locals.cartId);
        res.send(productCartItemsObj)
    };

    public addCartItem: ExpressHandler<AddCartItemRequest, AddCartItemResponse> = async (req, res) => {
        let { product_id, quantity } = req.body;

        // check if product is already exist in cart
        const isDuplicateItem = await this.doesProductExistsInCart(res.locals.cartId, product_id!)

        if (isDuplicateItem) {
            res.status(400).send({ error: ERRORS.DUPLICATE_CART_ITEM })
            return
        }

        const [isValid, newQuantity] = await this.validateQuantity(product_id as string, quantity as number)
        if (!isValid) {
            res.status(400).send({ error: ERRORS.OUT_OF_STOCK })
            return
        }

        const cartItem: CartItem = { cart_id: res.locals.cartId, product_id: product_id as string, quantity: newQuantity }
        await this.db.addCartItem(cartItem);

        res.send({ added: true })
    };

    public deleteCartItem: ExpressHandler<deleteCartItemRequest, deleteCartItemResponse> = async (req, res) => {
        const { itemId } = req.body;
        if (!itemId) {
            res.status(400).send({ error: 'missing parameters' })
            return
        }

        await this.db.deleteCartItem(itemId as string)
        res.send({ deleted: true })
    };

    public updateCartItemQuantity: ExpressHandler<updateCartItemQuantityRequest, updateCartItemQuantityResponse> = async (req, res) => {
        const { productId, itemId, quantity } = req.body;

        if (!itemId || !quantity) {
            res.status(400).send({ error: 'missing parameters' })
            return
        }

        const [isValid, newQuantity] = await this.validateQuantity(productId as string, quantity as number)
        if (!isValid) {
            res.status(400).send({ error: ERRORS.OUT_OF_STOCK })
            return
        }

        await this.db.updateCartItemQuantity(itemId as string, newQuantity);
        await this.db.updateTotalCartPrice(res.locals.cartId);

        res.send({ updated: true })
    };

    public createCheckoutSession: ExpressHandler<createCheckoutSessionRequest, createCheckoutSessionResponse> = async (req, res) => {
        // https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items
        let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
        let { items, success_url, cancel_url } = req.body;
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
            event = this.stripeClient.verifySessionEvent(payload as Buffer, sig as string, process.env.STRIPE_WEBHOOK_SK!);
            console.log("Verified", event.type)
        } catch (err) {
            console.log("error", (err as Error).message)
            return res.status(400).send({ error: (err as Error).message });
        }

        console.log("coming event", event.type)

        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log("Fulfilling order", session);

            // TODO: fill me in
            // Saving a copy of the order in database.
            // Delete temporary cart items 
            // Update Products Stock
            if (session.payment_status === 'paid') {
                // fulfillOrder(session);
            }
        }

        res.send({ completed: true });
    }

    private doesProductExistsInCart = async (cartId: string, productId: string) => {
        return ((await this.db.listCartItems(cartId)).items).some(cartItem => cartItem.product_id == productId)
    };

    private validateQuantity = async (product_id: string, quantity: number): Promise<[boolean, number]> => {
        // check if item is out of stock
        const noItemsInStock = (await this.db.getProduct(product_id as string))?.stock as number;
        if (noItemsInStock == 0) return [false, 0]

        // check if quantity is more than available items.
        if (quantity as number > noItemsInStock) {
            quantity = noItemsInStock
        }
        return [true, quantity]
    }
}