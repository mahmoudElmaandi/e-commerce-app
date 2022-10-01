import { Product } from '@ecommerce/shared';

export interface ProductDao {
    listProducts(page?: number, pageSize?: number): Promise<Product[]>
    createProduct(product: Product): Promise<void>
    getProduct(productId: string): Promise<Product | undefined>,
    deleteProduct(productId: string): Promise<void>,
    getPagination(currentPage: number, pageSize: number): Promise<{ currentPage: number, pageSize: number, total: number }>
}