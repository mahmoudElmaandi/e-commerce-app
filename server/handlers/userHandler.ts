import { signJWT } from './../auth';
import { User, SignUpRequest, SignUpResponse, SignInRequest, SignInResponse } from '@ecommerce/shared';
import { Datastore } from '../datastore';
import { ExpressHandler } from "../types";

export class UserHandler {
    private db: Datastore;

    constructor(db: Datastore) {
        this.db = db;
    }

    public signup: ExpressHandler<SignUpRequest, SignUpResponse> = async (req, res) => {
        const { username, email, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).send({ error: 'The following parameters cannot be missing from your request : Email, username, and password' });
        }

        if (await this.db.getUserByEmail(email)) return res.status(403).send({ error: 'A user with this email already exists' });

        if (await this.db.getUserByUsername(username)) return res.status(403).send({ error: 'A user with this username already exists' });

        // TODO: hash password
        const user = { email, username, password };

        const [userId, cartId, userRole,] = await this.db.createUser(user);

        const jwt = signJWT({ userId, admin: userRole, cartId })
        return res.status(200).send({ jwt });
    }

    public signin: ExpressHandler<SignInRequest, SignInResponse> = async (req, res) => {
        const { login, password } = req.body;
        if (!login || !password) res.sendStatus(400)

        const existingUser = await this.db.getUserByUsername(login as string) || await this.db.getUserByEmail(login as string)

        if (!existingUser || existingUser.password != password) return res.status(403).send({ error: 'wrong credentials' })
        const cartId = await this.db.getUserCartId(existingUser.id as string)

        const jwt = signJWT({ userId: existingUser.id as string, admin: existingUser.admin as boolean, cartId })

        return res.status(200).send({
            user: {
                username: existingUser.username,
                email: existingUser.email,
                id: existingUser.id,
            },
            jwt,
        });

    }
}