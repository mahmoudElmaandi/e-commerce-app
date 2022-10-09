export interface User {
    id?: string,
    username: string,
    password: string,
    email: string,
    admin?: boolean,
    stripe_id: string,
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

export interface Order {
    id?: string,
    user_id: string,
    total: number
}

export interface ProductOrderItem {
    id?: string,
    order_id: string,
    product_id: string,
    quantity: number,
    name: string,
    image: string,
    createdat: number
}