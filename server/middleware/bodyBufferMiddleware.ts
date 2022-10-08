import { EndpointsConfigs } from '@ecommerce/shared';
import bodyParser from "body-parser";
import { NextFunction } from 'express';
import { ExpressHandler } from "../types";

export const bodyParserMiddleware: ExpressHandler<any, any> = async (req, res, next: NextFunction) => {
    if (req.originalUrl === EndpointsConfigs.handleCheckoutSessionEvents.url) {
        next()
    } else {
        bodyParser.json()(req, res, next);
    }
}