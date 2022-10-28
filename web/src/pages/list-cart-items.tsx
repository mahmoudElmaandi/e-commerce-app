import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Flex, Heading, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react";
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
        <SimpleGrid id='cart' columns={[1, null, 2]}
            display={{ base: "grid", lg: 'grid', md: "block", sm: 'block' }}
            m='2' spacingX='9' spacingY='10' >

            <Flex id='cart-items' flexDir='row' justifyContent='flex-start' flexWrap='wrap' gap='10px' marginTop='10px' >
                {
                    items.map((productCartItem: ProductCartItem, index) => (
                        <ProductCartItemCard key={index} productCartItem={productCartItem} refetchCartItems={refetchCartItems}  ></ProductCartItemCard>
                    ))
                }
                {items.length === 0 && 'Cart is empty'}
            </Flex>

            <Stack id='cart-checkout' spacing="8" borderWidth="2px" rounded="lg" margin='8' padding="10"
                height='sm' width={{ base: "sm", md: "xs", sm: 'sm' }}>
                <Heading size="md">Order Summary</Heading>

                <Stack spacing="6">
                    <Flex justify="space-between">
                        <Text fontSize="lg" fontWeight="semibold">
                            Total
                        </Text>
                        <Text fontSize="xl" fontWeight="extrabold">
                            ${totalPrice}
                        </Text>
                    </Flex>
                </Stack>

                {
                    items.length !== 0 &&
                    <Button colorScheme="blue" size="lg" fontSize="md" onClick={createCheckoutSession} rightIcon={<ArrowForwardIcon />}>
                        Checkout Session
                    </Button>
                }
                {
                    items.length !== 0 &&
                    <Button as={Link} to='checkout' colorScheme="blue" size="lg" fontSize="md" rightIcon={<ArrowForwardIcon />}>
                        Checkout
                    </Button>
                }
            </Stack>
        </SimpleGrid>
    )
}