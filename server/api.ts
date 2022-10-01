import { User, Product, Category } from './types';

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

import { RequestHandler } from 'express';
import exp from 'constants';
import { type } from 'os';

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