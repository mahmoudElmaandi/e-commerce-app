import { ListOrderItemsRequest, ListOrderItemsResponse } from '@ecommerce/shared'
import { ExpressHandler } from '../types';
import { Datastore } from './../datastore/index';
export class OrderHandler {
    private db: Datastore;

    constructor(db: Datastore) {
        this.db = db
    }

    public listOrderItems: ExpressHandler<ListOrderItemsRequest, ListOrderItemsResponse> = async (req, res) => {
        const items = await this.db.listOrderItems(res.locals.userId)
        res.send({ items })
    }
}