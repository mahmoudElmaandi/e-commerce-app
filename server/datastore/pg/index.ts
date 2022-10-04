import { ProductCartItem } from '@ecommerce/shared';
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
        return (await this.pool.query('INSERT INTO Carts (user_id) VALUES ($1) RETURNING id', [userID])).rows[0].id
    };

    async getUserCartId(userID: string): Promise<string> {
        return (await this.pool.query('SELECT id FROM Carts WHERE user_id = $1', [userID])).rows[0].id
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
        await this.pool.query(`INSERT INTO Products (name,des,image,sku,price,categoryId,stock) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [product.name, product.des, product.image, product.sku, product.price, category?.id, product.stock]
        )
    };

    async getProduct(productId: string): Promise<Product | undefined> {
        return (await this.pool.query('SELECT * FROM Products WHERE id = $1', [productId])).rows[0]
    };

    async deleteProduct(productId: string): Promise<void> {
        await this.pool.query('DELETE FROM Products WHERE id = $1', [productId])
    };

    async addCartItem(cartItem: CartItem): Promise<void> {
        await this.pool.query(`INSERT INTO CartItems (cart_id,product_id,quantity) VALUES ($1, $2, $3)`, [cartItem.cart_id, cartItem.product_id, cartItem.quantity])
    };

    async listCartItems(cartId: string): Promise<{ items: ProductCartItem[], totalPrice: number }> {
        const items: ProductCartItem[] = (await this.pool.query(`
        SELECT ci.id as cart_item_id,ci.quantity,p.id as product_id, p.price, p.name, p.image, p.stock
        FROM (SELECT id,product_id,quantity FROM cartitems WHERE cart_id = $1) as ci 
        INNER JOIN products as p ON ci.product_id = p.id`, [cartId])).rows

        const totalPrice = await this.calculateTotalCartPrice(cartId);
        return { items, totalPrice }
    };

    private async calculateTotalCartPrice(cartId: string): Promise<number> {
        return (await this.pool.query(`
        SELECT SUM(p.price * ci.quantity) as total 
        FROM (SELECT id,product_id,quantity FROM cartitems WHERE cart_id = $1) as ci 
        INNER JOIN products as p ON ci.product_id = p.id 
        `, [cartId])).rows[0].total as number
    };

    async updateTotalCartPrice(cartId: string): Promise<void> {
        const totalPrice = await this.calculateTotalCartPrice(cartId);
        await this.pool.query(`UPDATE Carts SET total = $1 WHERE id =$2`, [totalPrice, cartId])
    };

    async deleteCartItem(itemId: string): Promise<void> {
        await this.pool.query(`DELETE FROM CartItems WHERE id = $1`, [itemId])
    };

    async updateCartItemQuantity(itemId: string, quantity: number): Promise<void> {
        await this.pool.query(`UPDATE CartItems SET quantity = $1 WHERE id = $2`, [quantity, itemId])
    }

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