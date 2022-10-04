export interface User {
    id?: string,
    username: string,
    password: string,
    email: string,
    admin?: boolean,
    createdAt?: number
}

export interface Product {
    id?: string,
    name: string,
    des: string,
    image: string,
    sku: string,
    price: number,
    stock?: number,
    categoryId: string,
    createdAt?: number
};

export interface Category {
    id?: string,
    name: string,
    createdAt?: number
}

export interface CartItem {
    id?: string,
    cart_id?: string,
    product_id: string,
    quantity: number
}

export interface ProductCartItem {
    cart_item_id: string,
    quantity: number,
    product_id: string,
    price: number
    name: string,
    image: string,
    stock?: number
}