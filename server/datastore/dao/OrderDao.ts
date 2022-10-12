import { Order, ProductOrderItem } from "@ecommerce/shared"

export interface OrderDao {
    listOrderItems(userId: string): Promise<ProductOrderItem[]>
    calculateOrderAmount(cartId: string): Promise<number>
    fulfillOrder(userId: string, cartId: string, total: number): Promise<void>
}