import { UserDao } from './dao/UserDao';
import { pgDatastore } from './pg';
import { CategoryDao } from './dao/CategoryDao';
import { ProductDao } from './dao/ProductDao';
import { Pool } from 'pg';
import { CartDao } from './dao/CartDao';
import { OrderDao } from './dao/OrderDao';

export interface Datastore extends UserDao, ProductDao, CategoryDao, CartDao, OrderDao { }

export let db: Datastore;

export async function initDb(pool: Pool) {
    db = new pgDatastore(pool);
}