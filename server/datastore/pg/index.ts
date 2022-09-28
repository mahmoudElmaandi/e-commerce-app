import { Datastore } from './../index';
import { Pool } from 'pg';
import { Product, Category } from '../../types';

export class pgDatastore implements Datastore {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    };

    async listProducts(page: number = 1, pageSize: number = 10): Promise<Product[]> {
        const offest = (page! - 1) * pageSize!;
        return (await this.pool.query('SELECT * FROM Product ORDER BY createdAt DESC LIMIT $1 OFFSET $2', [pageSize, offest])).rows
    };

    async getPagination(currentPage: number, pageSize: number = 10) {
        return { currentPage, pageSize, total: (await this.pool.query(`SELECT COUNT(id) as length FROM Product`)).rows[0].length }
    };

    async createProduct(product: Product): Promise<void> {
        const category = await this.getCategoryByName(product.categoryId);
        console.log("category", category)
        await this.pool.query(`INSERT INTO Product (name,des,image,sku,price,categoryId) VALUES ($1, $2, $3, $4, $5,$6)`,
            [product.name, product.des, product.image, product.sku, product.price, category?.id]
        )
    };

    async getProduct(productId: string): Promise<Product | undefined> {
        return (await this.pool.query('SELECT * From Product WHERE id = $1', [productId])).rows[0]
    };

    async deleteProduct(productId: string): Promise<void> {
        await this.pool.query('DELETE FROM Product WHERE id = $1', [productId])
    };

    async listCategrories(): Promise<Category[]> {
        return (await this.pool.query('SELECT * FROM Category')).rows
    };

    async createCategory(category: Category): Promise<void> {
        await this.pool.query(`INSERT INTO Category (name) VALUES($1) `, [category.name])
    };

    async getCategoryByName(categoryName: string): Promise<Category | undefined> {
        const { rows, rowCount } = await this.pool.query<Category>(`SELECT * FROM Category WHERE name = $1`, [categoryName])
        return rows[0]
    };

    async getCategoryById(categoryId: string): Promise<Category | undefined> {
        const { rows, rowCount } = await this.pool.query<Category>(`SELECT * FROM Category WHERE id = $1`, [categoryId])
        console.log("res", rows)
        return rows[0]
    };

    async deleteCategoryByName(categoryName: string): Promise<void> {
        await this.pool.query('DELETE FROM Category WHERE name = $1', [categoryName])
    };

    async deleteCategoryById(categoryId: string): Promise<void> {
        await this.pool.query('DELETE FROM Category WHERE id = $1', [categoryId])
    }
};