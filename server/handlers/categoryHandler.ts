import { CreateCategoryRequest, CreateCategoryResponse, GetCategoryResponse, ListCategoriesRequest, ListCategoriesResponse, DeleteCategoryResponse } from '@ecommerce/shared';
import { Datastore } from '../datastore/index';
import { ExpressHandler, ExpressHandlerWithParams } from "../types";

export class CategoryHandler {
    private db: Datastore;

    constructor(db: Datastore) {
        this.db = db;
    }

    public list: ExpressHandler<ListCategoriesRequest, ListCategoriesResponse> = async (req, res) => {
        res.send({ categories: await this.db.listCategrories() })
    };

    public create: ExpressHandler<CreateCategoryRequest, CreateCategoryResponse> = async (req, res) => {
        if (!req.body.name) {
            return res.sendStatus(400);
        };
        await this.db.createCategory({ "name": req.body.name })
        return res.send({});
    };

    public get: ExpressHandlerWithParams<{ id: string }, null, GetCategoryResponse> = async (req, res) => {
        if (!req.params.id) {
            return res.sendStatus(400);
        }
        return res.send({ category: await this.db.getCategoryById(req.params.id) });
    };

    public delete: ExpressHandlerWithParams<{ id: string }, null, DeleteCategoryResponse> = async (req, res) => {
        if (!req.params.id) {
            return res.sendStatus(400);
        }
        if (req.params.id) await this.db.deleteCategoryById(req.params.id);
        return res.send({});
    }
}