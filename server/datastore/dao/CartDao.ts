import { CartItem, ProductCartItem } from "@ecommerce/shared"

export interface CartDao {
    listCartItems(cartId: string): Promise<ProductCartItem[]>
    getUserCartId(userId: string): Promise<string> // used at signing as a param into jwtSign
    addCartItem(cartItem: CartItem): Promise<void>
    updateCartItemQuantity(itemId: string, quantity: number): Promise<void>
    deleteCartItem(itemId: string): Promise<void>
}