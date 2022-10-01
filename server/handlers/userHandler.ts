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
        const user: User = { email, username, password };

        await this.db.createUser(user);

        // TODO: implement jwt
        return res.status(200).send({ jwt: 'yourJwt' });
    }

    public signin: ExpressHandler<SignInRequest, SignInResponse> = async (req, res) => {
        const { login, password } = req.body;
        if (!login || !password) res.sendStatus(400)

        const existingUser = await this.db.getUserByUsername(login as string) || await this.db.getUserByEmail(login as string)
        console.log(existingUser)
        if (!existingUser || existingUser.password != password) return res.sendStatus(403)

        return res.status(200).send({
            user: {
                username: existingUser.username,
                email: existingUser.email,
                id: existingUser.id,
            },
            "jwt": "yourJWT",
        });

    }
}