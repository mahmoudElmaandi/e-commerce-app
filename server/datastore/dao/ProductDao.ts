import { Product } from './../../types';

export interface ProductDao {
    listProducts(page?: number, limit?: number): Promise<Product[]>
    createProduct(product: Product): Promise<void>
    getProduct(productId: string): Promise<Product | undefined>,
    deleteProduct(productId: string): Promise<void>,
    getPagination(limit: number): Promise<{ noPages: number }>
}