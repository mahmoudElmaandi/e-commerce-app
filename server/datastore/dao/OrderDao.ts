import { Order, ProductOrderItem } from "@ecommerce/shared"

export interface OrderDao {
    listOrderItems(userId: string): Promise<ProductOrderItem[]>
    fulfillOrder(userId: string, cartId: string, total: number): Promise<void>
}