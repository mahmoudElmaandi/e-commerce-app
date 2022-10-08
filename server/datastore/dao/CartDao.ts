import { CartItem, ProductCartItem } from "@ecommerce/shared"

export interface CartDao {
    listCartItems(cartId: string): Promise<{ items: ProductCartItem[], totalPrice: number }>
    getUserCartId(userId: string): Promise<string> // used at signing as a param into jwtSign
    addCartItem(cartItem: CartItem): Promise<void>
    updateCartItemQuantity(itemId: string, quantity: number): Promise<void>
    deleteCartItem(itemId: string): Promise<void>
    updateTotalCartPrice(cartId: string): Promise<void>
    createCheckoutSession(cartId: string): Promise<void>
    getUserStripeID(userId: string): Promise<string>
}