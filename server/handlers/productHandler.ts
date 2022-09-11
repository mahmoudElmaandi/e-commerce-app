import { Product } from './../types';
import { CreateProductRequest, CreateProductResponse, GetProductResponse, ExpressHandlerWithParams, DeleteProductResponse } from './../api';
import { Datastore } from './../datastore/index';
import { ExpressHandler, ListProductsRequest, ListProductsResponse } from "../api";

export class ProductHandler {
    private db: Datastore;

    constructor(db: Datastore) {
        this.db = db;
    }

    public list: ExpressHandler<ListProductsRequest, ListProductsResponse> = async (req, res) => {
        return res.send({ products: await this.db.listProducts(req.query.page, req.query.limit), pagination: await this.db.getPagination(req.query.limit) });
    };

    public create: ExpressHandler<CreateProductRequest, CreateProductResponse> = async (req, res) => {
        const product: Product = {
            name: req.body.name!,
            categoryId: req.body.categoryId!,
            des: req.body.des!,
            image: req.body.image!,
            sku: req.body.sku!,
            price: req.body.price!
        };
        await this.db.createProduct(product);
        return res.send({});
    };

    public get: ExpressHandlerWithParams<{ id: string }, null, GetProductResponse> = async (req, res) => {
        if (!req.params.id) return res.sendStatus(400);
        res.send({ product: await this.db.getProduct(req.params.id) })
    };

    public delete: ExpressHandlerWithParams<{ id: string }, null, DeleteProductResponse> = async (req, res) => {
        if (!req.params.id) {
            return res.sendStatus(400);
        }
        if (req.params.id) await this.db.deleteProduct(req.params.id);
        return res.send({});
    }
};