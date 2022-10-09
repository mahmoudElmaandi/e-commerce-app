import { OrderHandler } from './handlers/orderHandler';
import { CartHandler } from './handlers/cartHandler';
import { jwtParseMiddleware, isAuthenticatedMiddleware, isAuthorizedMiddleware } from './middleware/authMiddleware';
import { UserHandler } from './handlers/userHandler';
import express, { Express, Request, Response, RequestHandler } from 'express'
import { CategoryHandler } from './handlers/categoryHandler';
import { ProductHandler } from './handlers/productHandler';
import { Pool } from 'pg';
import { initDb, db } from './datastore';
import { Endpoints, EndpointsConfigs } from '@ecommerce/shared';
import asyncHandler from "express-async-handler"
import cors from 'cors';
import { initPaymentGateway, stripeGateway } from './payment';
import bodyParser from 'body-parser';
import { bodyParserMiddleware } from './middleware/bodyBufferMiddleware';

export async function createServer(pool: Pool, stripeSK: string) {

    await initDb(pool);
    await initPaymentGateway(stripeSK);

    const app: Express = express();

    app.use((req, res, next) => {
        console.log(`${new Date().toLocaleString()} ${req.method}, ${req.url} ${req.body ? req.body : ""}`)
        next()
    });

    app.use(cors())
    // app.use(express.json());

    app.get('/', (req: Request, res: Response) => {
        res.send('home')
    });

    // Use JSON parser for all non-webhook routes, and pass raw request for stripe to verify.
    app.use(bodyParserMiddleware);

    const userHandler = new UserHandler(db, stripeGateway);
    const productHandler = new ProductHandler(db);
    const categoryHandler = new CategoryHandler(db);
    const cartHandler = new CartHandler(db, stripeGateway);
    const orderHandler = new OrderHandler(db);

    const EndpointsHandlers: { [key in Endpoints]: RequestHandler<any, any> } = {

        [Endpoints.signup]: userHandler.signup,
        [Endpoints.signin]: userHandler.signin,

        [Endpoints.listProducts]: productHandler.list,
        [Endpoints.createProduct]: productHandler.create,
        [Endpoints.getProduct]: productHandler.get,
        [Endpoints.deleteProduct]: productHandler.delete,

        [Endpoints.listCategories]: categoryHandler.list,
        [Endpoints.getCategory]: categoryHandler.get,
        [Endpoints.createCategroy]: categoryHandler.create,
        [Endpoints.deleteCategroy]: categoryHandler.delete,

        [Endpoints.listCartItems]: cartHandler.listCartItems,
        [Endpoints.addCartItem]: cartHandler.addCartItem,
        [Endpoints.updateCartItemQuantity]: cartHandler.updateCartItemQuantity,
        [Endpoints.deleteCartItem]: cartHandler.deleteCartItem,

        [Endpoints.createCheckOutSession]: cartHandler.createCheckoutSession,
        [Endpoints.handleCheckoutSessionEvents]: cartHandler.handleCheckoutSessionEvents,

        [Endpoints.listOrderItems]: orderHandler.listOrderItems,

    };

    Object.keys(Endpoints).forEach(entry => {
        const config = EndpointsConfigs[entry as Endpoints];
        const handler = EndpointsHandlers[entry as Endpoints];
        config.authenticated && config.authorized ?
            app[config.method](config.url, jwtParseMiddleware, isAuthenticatedMiddleware, isAuthorizedMiddleware, asyncHandler(handler))
            :
            config.authenticated && !config.rawReq && !config.authorized ?
                app[config.method](config.url, jwtParseMiddleware, isAuthenticatedMiddleware, asyncHandler(handler))
                : config.rawReq ?
                    app[config.method](config.url, bodyParser.raw({ type: 'application/json' }), asyncHandler(handler))
                    :
                    app[config.method](config.url, jwtParseMiddleware, asyncHandler(handler));
        // console.log(entry,config,handler)
    });

    return app;
};