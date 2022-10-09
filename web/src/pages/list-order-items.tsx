import { Flex, Skeleton } from "@chakra-ui/react"
import { EndpointsConfigs, ListOrderItemsRequest, ListOrderItemsResponse, ProductOrderItem } from "@ecommerce/shared"
import { useQuery } from "react-query"
import { ProductOrderItemCard } from "../components/order-item-card"
import { callEndpoint } from "../fetch"

export const ListOrdersItems = () => {
    const { data, error, isLoading, isError } = useQuery(['listorderitems'], () =>
        callEndpoint<ListOrderItemsRequest, ListOrderItemsResponse>(EndpointsConfigs.listOrderItems)
    )

    if (isLoading) {

        return (
            <>
                <Flex gap='10px' marginTop='10px' flexDir='row' align='flex-start' justify='center' flexWrap='wrap'>
                    <Skeleton width='360px' height='170px' borderRadius='13px' />
                    <Skeleton width='360px' height='170px' borderRadius='13px' />
                </Flex>
            </>
        )
    }

    if (isError) {
        return <span>Error: Couldn't load order</span>
    }

    const { items } = data as ListOrderItemsResponse

    return (
        <Flex gap='5px' marginTop='10px' flexDir='row' width='100%' alignItems='flex-start' justify='center' flexWrap='wrap'>
            {
                items.map((productCartItem: ProductOrderItem, index) => (
                    <ProductOrderItemCard key={index} productOrderitem={productCartItem}  ></ProductOrderItemCard>
                ))
            }
            {
                items.length === 0 && 'No Orders'
            }
        </Flex>
    )
}