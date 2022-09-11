import { Product, Category } from './types';

// Products APIs
export interface ListProductsRequest { }
export interface ListProductsResponse {
    products: Product[];
    pagination: { noPages: number }
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

import { RequestHandler } from 'express';

type WithError<T> = T & { error: string };

export type ExpressHandler<Req, Res> = RequestHandler<
    string,
    Partial<WithError<Res>>,
    Partial<Req>,
    any
>;

export type ExpressHandlerWithParams<Params, Req, Res> = RequestHandler<
    Partial<Params>,
    Partial<WithError<Res>>,
    Partial<Req>,
    any
>;