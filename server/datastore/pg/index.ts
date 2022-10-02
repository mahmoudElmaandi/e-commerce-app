import { Datastore, db } from './../index';
import { Pool } from 'pg';
import { Product, Category, User, CartItem } from '@ecommerce/shared';

export class pgDatastore implements Datastore {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async createUser(user: User): Promise<[string, string, boolean]> {
        const { id, admin } = (await this.pool.query('INSERT INTO Users (username,email,password) VALUES ($1, $2, $3 ) RETURNING id,admin', [user.username, user.email, user.password])).rows[0]
        const cartId = await this.createCart(id)
        return [id, cartId, admin]
    };

    async getUserById(id: string): Promise<User | undefined> {
        return (await this.pool.query('SELECT * FROM Users WHERE id = $1', [id])).rows[0]
    };

    async getUserByEmail(email: string): Promise<User | undefined> {
        return (await this.pool.query('SELECT * FROM Users WHERE email = $1', [email])).rows[0]
    };

    async getUserByUsername(username: string): Promise<User | undefined> {
        return (await this.pool.query('SELECT * FROM Users WHERE username = $1', [username])).rows[0]
    };

    async deleteUser(id: string): Promise<void> {
        await this.pool.query('DELETE FROM Users WHERE id = $1', [id])
    };

    private async createCart(userID: string): Promise<string> {
        return (await this.pool.query('INSERT INTO Carts (userID) VALUES ($1) RETURNING id', [userID])).rows[0].id
    };

    async getUserCartId(userID: string): Promise<string> {
        return (await this.pool.query('SELECT id FROM Carts WHERE userId = $1', [userID])).rows[0].id
    };

    async listProducts(page: number = 1, pageSize: number = 10): Promise<Product[]> {
        const offest = (page! - 1) * pageSize!;
        return (await this.pool.query('SELECT * FROM Products ORDER BY createdAt DESC LIMIT $1 OFFSET $2', [pageSize, offest])).rows
    };

    async getPagination(currentPage: number, pageSize: number = 10) {
        return { currentPage, pageSize, total: (await this.pool.query(`SELECT COUNT(id) as length FROM Products`)).rows[0].length }
    };

    async createProduct(product: Product): Promise<void> {
        const category = await this.getCategoryByName(product.categoryId);
        console.log("category", category)
        await this.pool.query(`INSERT INTO Products (name,des,image,sku,price,categoryId) VALUES ($1, $2, $3, $4, $5,$6)`,
            [product.name, product.des, product.image, product.sku, product.price, category?.id]
        )
    };

    async getProduct(productId: string): Promise<Product | undefined> {
        return (await this.pool.query('SELECT * FROM Products WHERE id = $1', [productId])).rows[0]
    };

    async deleteProduct(productId: string): Promise<void> {
        await this.pool.query('DELETE FROM Products WHERE id = $1', [productId])
    };

    async addCartItem(cartItem: CartItem): Promise<void> {
        await this.pool.query(`INSERT INTO CartItems (cartId,productId,quantity) VALUES ($1, $2, $3)`, [cartItem.cartId, cartItem.productId, cartItem.quantity])
    };

    async listCategrories(): Promise<Category[]> {
        return (await this.pool.query('SELECT * FROM Categories')).rows
    };

    async createCategory(category: Category): Promise<void> {
        await this.pool.query(`INSERT INTO Categories (name) VALUES($1) `, [category.name])
    };

    async getCategoryByName(categoryName: string): Promise<Category | undefined> {
        const { rows, rowCount } = await this.pool.query<Category>(`SELECT * FROM Categories WHERE name = $1`, [categoryName])
        return rows[0]
    };

    async getCategoryById(categoryId: string): Promise<Category | undefined> {
        const { rows, rowCount } = await this.pool.query<Category>(`SELECT * FROM Categories WHERE id = $1`, [categoryId])
        console.log("res", rows)
        return rows[0]
    };

    async deleteCategoryByName(categoryName: string): Promise<void> {
        await this.pool.query('DELETE FROM Categories WHERE name = $1', [categoryName])
    };

    async deleteCategoryById(categoryId: string): Promise<void> {
        await this.pool.query('DELETE FROM Categories WHERE id = $1', [categoryId])
    }
};