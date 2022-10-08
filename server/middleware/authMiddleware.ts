import { verifyJWT } from './../auth';
import { jwtPayload } from './../types';
import { ExpressHandler } from "../types";
import { TokenExpiredError, VerifyErrors } from 'jsonwebtoken';
export const jwtParseMiddleware: ExpressHandler<any, any> = async (req, res, next) => {
    // Use body-parser to retrieve the raw body as a buffer

    const jwt = req.headers.authorization?.split(' ')[1];
    if (!jwt) return next();
    let payload: jwtPayload;

    try {
        payload = verifyJWT(jwt)
    } catch (error) {
        const verifyErr = error as VerifyErrors;
        if (verifyErr instanceof TokenExpiredError) {
            return res.status(401).send({ error: "expired token" });
        }
        return res.status(401).send({ error: "bad token" });
    }

    res.locals.userId = payload.userId;
    res.locals.cartId = payload.cartId;
    res.locals.admin = payload.admin;

    return next()
};

export const isAuthenticatedMiddleware: ExpressHandler<any, any> = async (_, res, next) => {
    if (!res.locals.userId) {
        return res.sendStatus(401);
    }
    return next();
};

export const isAuthorizedMiddleware: ExpressHandler<any, any> = async (_, res, next) => {
    if (!res.locals.userId && !res.locals.admin) {
        return res.sendStatus(401);
    }
    return next();
};