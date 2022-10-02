import { CartItem } from '@ecommerce/shared';
import { AddCartItemRequest, AddCartItemResponse } from './../../shared/src/api';
import { ExpressHandler } from './../types';
import { Datastore } from '../datastore';

export class CartHandler {
    private db: Datastore;

    constructor(db: Datastore) {
        this.db = db;
    }

    public addCartItem: ExpressHandler<AddCartItemRequest, AddCartItemResponse> = async (req, res) => {
        const { cartId, productId, quantity } = req.body;
        await this.db.addCartItem({ cartId, productId, quantity } as CartItem)
    }

}