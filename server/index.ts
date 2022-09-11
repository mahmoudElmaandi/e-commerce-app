import { Pool } from "pg";
import { createServer } from "./server";
import dbConfig from './datastore/pg/database.json';

const pool = new Pool(dbConfig);

(async () => {
    const server = await createServer(pool);

    server.listen(3001, () => {
        console.log(`app is started at http://localhost:3001`)
    })
})();

