import { Pool } from "pg";
import { createServer } from "./server";
import dbConfig from './datastore/pg/database.json';


const pool = new Pool(dbConfig);

import dotenv from 'dotenv';
dotenv.config();

(async () => {
    const server = await createServer(pool, process.env.STRIPE_SK!, process.env.STRIPE_WEBHOOK_SK!);

    server.listen(3001, () => {
        console.log(`app is started at http://localhost:3001`)
    })
})();

