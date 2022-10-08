import { User, Product, Category, CartItem, ProductCartItem } from './types';

// Users APIs
export type SignUpRequest = Pick<User, 'username' | 'email' | 'password'>;
export interface SignUpResponse { jwt: string }


export interface SignInRequest { login: string; password: string; }
export type SignInResponse = {
    user: Pick<User, 'email' | 'username' | 'id'>;
    jwt: string;
};

export interface Pagination { total: number, currentPage: number, pageSize: number };

// Products APIs
export interface ListProductsRequest { }
export interface ListProductsResponse {
    products: Product[];
    pagination: Pagination
}

export interface CreateProductRequest extends Product { };
export interface CreateProductResponse { }

export interface GetProductResponse { product: Product }
export interface DeleteProductResponse { };

// Categories APIs
export interface ListCategoriesRequest { }
export interface ListCategoriesResponse {
    categories: Category[]
};

export type CreateCategoryRequest = Pick<Category, 'name'>;
export interface CreateCategoryResponse { }

export interface GetCategoryResponse { category: Category }

export interface DeleteCategoryResponse { };


// Cart 
export interface AddCartItemRequest extends CartItem { };
export interface AddCartItemResponse { added: boolean }

export interface ListCartItemsRequest { };
export interface ListCartItemsResponse { items: ProductCartItem[], totalPrice: number }

export interface updateCartItemQuantityRequest { productId: string, itemId: string, quantity: number };
export interface updateCartItemQuantityResponse { updated: boolean };

export interface deleteCartItemRequest { itemId: string };
export interface deleteCartItemResponse { deleted: boolean };

export interface createCheckoutSessionRequest { items: ProductCartItem[], totalPrice: number, success_url: string, cancel_url: string };
export interface createCheckoutSessionResponse { sessionUrl: string };
