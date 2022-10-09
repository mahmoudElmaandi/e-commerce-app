import React, { useCallback, useState } from "react";
import { AddCartItemRequest, AddCartItemResponse, EndpointsConfigs, ERRORS, Product } from "@ecommerce/shared";
import { Box, Flex, Image, Text, Button, Alert, AlertIcon } from "@chakra-ui/react"
import { ApiError, callEndpoint } from "../fetch";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { id, name, des, image, price, sku, stock } = product;

    const [hasError, setHasError] = useState(false);
    const [resError, setResError] = useState('');

    const addToCart = async () => {
        try {
            await callEndpoint<AddCartItemRequest, AddCartItemResponse>(EndpointsConfigs.addCartItem, {
                product_id: id as string, quantity: 1
            });
            setHasError(false)
        } catch (e) {
            setHasError(true)
            setResError((e as ApiError).message);
        }
    }

    return (
        <Flex id="product" flexDir='column' alignItems='center' justifyItems='flex-start'
            width='100%' maxWidth='350px' height='300px' maxHeight='300px'
            padding='5px' border='2px solid white' borderRadius='5px' boxShadow='lg'>


            <Flex id="product-image" width='150px' height='120px'>
                <Image src={image} width='150px' maxWidth='150px' height='120px' maxHeight='120px' ></Image>
            </Flex>

            <Flex id="product-info" width='300px' maxWidth='500px' height='80px' maxHeight='100px' flexDir='column' m='10px'>
                <Text fontSize={15} fontWeight='bold' >{name} </Text>
            </Flex>

            <Flex id="product-controls" width='300px' maxWidth='500px' flexDir='column'>
                <Button disabled={stock === 0} onClick={async () => { await addToCart() }}>Add to Cart ${price}</Button>
                {hasError || stock === 0 ? <Alert status='warning' m='5px'><AlertIcon /> {resError || ERRORS.OUT_OF_STOCK} </Alert> : ''}
            </Flex>
        </Flex >
    )
};