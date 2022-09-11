import express, { Express, Request, Response, RequestHandler } from 'express'
import { CategoryHandler } from './handlers/categoryHandler';
import { db } from './datastore/index';
import { ProductHandler } from './handlers/productHandler';
import { Pool } from 'pg';
import { initDb } from './datastore';
import { Endpoints, EndpointsConfigs } from './endpoints';
import asyncHandler from "express-async-handler"
import cors from 'cors';

export async function createServer(pool: Pool) {

    await initDb(pool);

    const app: Express = express();

    app.use((req, res, next) => {
        console.log(`${new Date().toLocaleString()} ${req.method}, ${req.url} ${req.body ? req.body : ""}`)
        next()
    });

    app.use(cors())
    app.use(express.json());

    app.get('/', (req: Request, res: Response) => {
        res.send('home')
    });

    const productHandler = new ProductHandler(db);
    const categoryHandler = new CategoryHandler(db);

    const EndpointsHandlers: { [key in Endpoints]: RequestHandler<any, any> } = {

        [Endpoints.listProducts]: productHandler.list,
        [Endpoints.createProduct]: productHandler.create,
        [Endpoints.getProduct]: productHandler.get,
        [Endpoints.deleteProduct]: productHandler.delete,


        [Endpoints.listCategories]: categoryHandler.list,
        [Endpoints.getCategory]: categoryHandler.get,
        [Endpoints.createCategroy]: categoryHandler.create,
        [Endpoints.deleteCategroy]: categoryHandler.delete,
    };

    Object.keys(Endpoints).forEach(entry => {
        const config = EndpointsConfigs[entry as Endpoints];
        const handler = EndpointsHandlers[entry as Endpoints];
        app[config.method](config.url, asyncHandler(handler));
        // console.log(entry,config,handler)
    });

    return app;
};