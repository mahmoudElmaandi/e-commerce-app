import { CartItem } from "@ecommerce/shared"

export interface CartDao {
    getUserCartId(userId: string): Promise<string>
    addCartItem(cartItem: CartItem): Promise<void>
}