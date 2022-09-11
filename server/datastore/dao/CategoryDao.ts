import { Category } from './../../types';

export interface CategoryDao {
    listCategrories(): Promise<Category[]>,
    createCategory(category: Category): Promise<void>,
    getCategoryById(categoryId: string): Promise<Category | undefined>,
    getCategoryByName(categoryName: string): Promise<Category | undefined>,
    deleteCategoryById(categoryId: string): Promise<void>,
    deleteCategoryByName(categoryName: string): Promise<void>,
}