import jwt from 'jsonwebtoken';
import { jwtPayload } from './types';

import dotenv from 'dotenv';
dotenv.config()

const JWT_SECRET = process.env.JWTSECRET as string;
console.log("JWT_SECRET = ", JWT_SECRET);

export const signJWT = (payload: jwtPayload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '20d'
    })
}

export const verifyJWT = (jwtToken: string): jwtPayload => {
    return jwt.verify(jwtToken, JWT_SECRET) as jwtPayload
}