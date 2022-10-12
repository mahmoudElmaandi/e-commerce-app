import { Button, Flex, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import { createCheckoutSessionRequest, createCheckoutSessionResponse, EndpointsConfigs, ListCartItemsRequest, ListCartItemsResponse, ProductCartItem } from "@ecommerce/shared";
import { useQuery } from 'react-query';
import { Link } from "react-router-dom";

import { ProductCartItemCard } from '../components/cart-item-card';
import { callEndpoint } from "../fetch";

export const ListCartItems = () => {

    const { data, error, isLoading, isError, refetch: refetchCartItems } = useQuery(['listcartitems'], () =>
        callEndpoint<ListCartItemsRequest, ListCartItemsResponse>(EndpointsConfigs.listCartItems)
    );

    const createCheckoutSession = async () => {
        try {
            const { sessionUrl } = await callEndpoint<createCheckoutSessionRequest, createCheckoutSessionResponse>(EndpointsConfigs.createCheckOutSession, {
                success_url: `${window.location.origin}/success`, cancel_url: `${window.location.origin}`
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
        <SimpleGrid columns={[1, null, 2]} spacingX='1' spacingY={1} >

            <Flex id='checkout' flexDir='column' alignItems='center' justifyItems='center' marginTop='10px' p='10px' gap='5px'>
                <Text fontSize='25px' fontWeight='bold'> Total: ${Number(totalPrice).toFixed(2)}</Text>
                {
                    items.length !== 0 && <Button backgroundColor='darkblue' color='white' onClick={createCheckoutSession}>Checkout</Button>
                }
                {
                    items.length !== 0 && <Link to='checkout'><Button backgroundColor='gold' >CheckOut</Button></Link>
                }
            </Flex>

            <Flex id='cart-items' flexDir='row' justifyContent='center' flexWrap='wrap' gap='10px' margin='5px' marginTop='10px' >
                {
                    items.map((productCartItem: ProductCartItem, index) => (
                        <ProductCartItemCard key={index} productCartItem={productCartItem} refetchCartItems={refetchCartItems}  ></ProductCartItemCard>
                    ))
                }
                {items.length === 0 && 'Cart is empty'}
            </Flex>



        </SimpleGrid>
    )
}