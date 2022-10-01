export interface User {
    id?: string,
    username: string,
    password: string,
    email: string,
    createdAt?: number
}

export interface Product {
    id?: string,
    name: string,
    des: string,
    image: string,
    sku: string,
    price: number,
    categoryId: string,
    createdAt?: number
};

export interface Category {
    id?: string,
    name: string,
    createdAt?: number
}