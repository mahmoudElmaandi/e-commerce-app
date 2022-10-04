import { useQuery } from 'react-query';
import { deleteCartItemRequest, deleteCartItemResponse, EndpointsConfigs, ListCartItemsRequest, ListCartItemsResponse, Product, ProductCartItem } from "@ecommerce/shared";
import { ProductCard } from '../components/product-card';
import { Box, Flex, Image, Text, Link, Button, Stack, Skeleton } from "@chakra-ui/react"

import { ApiError, callEndpoint } from "../fetch";
import { ProductCartItemCard } from '../components/cart-item-card';
import { useCallback, useState } from 'react';

export const ListCartItems = () => {

    const { data, error, isLoading, isError, refetch: refetchCartItems } = useQuery(['listcartitems'], () =>
        callEndpoint<ListCartItemsRequest, ListCartItemsResponse>(EndpointsConfigs.listCartItems)
    );

    if (isLoading) {
        return (
            <>
                <Flex gap='10px' marginTop='10px' flexDir='row' align='flex-start' justify='center' flexWrap='wrap'>
                    <Skeleton width='360px' height='170px' borderRadius='13px' />
                    <Skeleton width='360px' height='170px' borderRadius='13px' />
                    <Skeleton width='360px' height='170px' borderRadius='13px' />
                    <Skeleton width='360px' height='170px' borderRadius='13px' />
                    <Skeleton width='360px' height='170px' borderRadius='13px' />
                    <Skeleton width='360px' height='170px' borderRadius='13px' />
                    <Skeleton width='360px' height='170px' borderRadius='13px' />
                    <Skeleton width='360px' height='170px' borderRadius='13px' />
                    <Skeleton width='360px' height='170px' borderRadius='13px' />
                </Flex>
            </>
        )
    }

    if (isError) {
        return <span>Error: Couldn't load cart items</span>
    }

    const { items } = data as ListCartItemsResponse

    return (

        <Flex gap='2px' marginTop='10px' flexDir='row' width='100%' align='flex-start' justify='flex-start' flexWrap='wrap'>
            {
                items.map((productCartItem: ProductCartItem, index) => (
                    <ProductCartItemCard key={index} productCartItem={productCartItem} refetchCartItems={refetchCartItems}  ></ProductCartItemCard>
                ))
            }
            {
                items.length === 0 && 'Cart is empty'
            }
        </Flex>
    )
}