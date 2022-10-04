import { deleteCartItemRequest, deleteCartItemResponse } from './../../shared/src/api';
import { AddCartItemRequest, AddCartItemResponse, CartItem, ERRORS, ListCartItemsRequest, ListCartItemsResponse, updateCartItemQuantityRequest, updateCartItemQuantityResponse } from '@ecommerce/shared';
import { Datastore } from '../datastore';
import { ExpressHandler } from './../types';

export class CartHandler {
    private db: Datastore;

    constructor(db: Datastore) {
        this.db = db;
    }

    public listCartItems: ExpressHandler<ListCartItemsRequest, ListCartItemsResponse> = async (req, res) => {
        const productCartItems = await this.db.listCartItems(res.locals.cartId);
        res.send({ items: productCartItems })
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
        if (!itemId) res.status(400).send({ error: 'missing parameters' })

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

        await this.db.updateCartItemQuantity(itemId as string, newQuantity)
        res.send({ updated: true })
    };

    private doesProductExistsInCart = async (cartId: string, productId: string) => {
        return (await this.db.listCartItems(cartId)).some(cartItem => cartItem.product_id == productId)
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