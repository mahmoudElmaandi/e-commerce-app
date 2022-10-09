import { Button, Flex, Skeleton, Square, Text } from "@chakra-ui/react";
import { createCheckoutSessionRequest, createCheckoutSessionResponse, EndpointsConfigs, ListCartItemsRequest, ListCartItemsResponse, ProductCartItem } from "@ecommerce/shared";
import { useQuery } from 'react-query';

import { ProductCartItemCard } from '../components/cart-item-card';
import { callEndpoint } from "../fetch";

export const ListCartItems = () => {

    const { data, error, isLoading, isError, refetch: refetchCartItems } = useQuery(['listcartitems'], () =>
        callEndpoint<ListCartItemsRequest, ListCartItemsResponse>(EndpointsConfigs.listCartItems)
    );

    const createCheckoutSession = async () => {
        try {
            const { sessionUrl } = await callEndpoint<createCheckoutSessionRequest, createCheckoutSessionResponse>(EndpointsConfigs.createCheckOutSession, {
                items, totalPrice, success_url: `${window.location.origin}/success`, cancel_url: `${window.location.origin}`
            });
            window.location.replace(sessionUrl)
        } catch (e) {
        }
    };

    if (isLoading) {
        return (
            <>
                <Flex gap='10px' marginTop='10px' flexDir='row' align='flex-start' justify='center' flexWrap='wrap'>
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                </Flex>
            </>
        )
    }

    if (isError) {
        return <span>Error: Couldn't load cart items</span>
    }

    const { items, totalPrice } = data as ListCartItemsResponse

    return (
        <Flex flexDir='row' alignItems='center' justifyItems='center' flexWrap='wrap-reverse'>

            <Flex id='cart-items' width='80%' flexDir='row' align='flex-start' justify='center' flexWrap='wrap' gap='10px' margin='5px' marginTop='10px' >
                {
                    items.map((productCartItem: ProductCartItem, index) => (
                        <ProductCartItemCard key={index} productCartItem={productCartItem} refetchCartItems={refetchCartItems}  ></ProductCartItemCard>
                    ))
                }
                {items.length === 0 && 'Cart is empty'}
            </Flex>

            <Flex id='checkout' flexDir='column' alignItems='center' justifyItems='center' marginTop='10px' p='10px' gap='5px'>
                <Text fontSize='25px' fontWeight='bold'> Total: ${Number(totalPrice).toFixed(2)}</Text>
                {
                    items.length !== 0 && <Button width='100%' backgroundColor='darkblue' color='white' onClick={createCheckoutSession}>Checkout</Button>
                }
            </Flex>

        </Flex>



    )
}