import React, { useCallback, useState } from "react";
import { AddCartItemRequest, AddCartItemResponse, EndpointsConfigs, ERRORS, Product } from "@ecommerce/shared";
import { Box, Flex, Image, Text, Button, Alert, AlertIcon, Tooltip, chakra, Icon, useToast } from "@chakra-ui/react"
import { ApiError, callEndpoint } from "../fetch";
import { FiShoppingCart } from 'react-icons/fi';
import { BsCartX, BsFillCartCheckFill } from 'react-icons/bs';

import { Link } from 'react-router-dom';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { id, name, des, image, price, sku, stock } = product;

    const [hasError, setHasError] = useState(false);
    const [resStatusMsg, setResStatusMsg] = useState('');
    const toast = useToast()

    const addToCart = async () => {
        try {
            await callEndpoint<AddCartItemRequest, AddCartItemResponse>(EndpointsConfigs.addCartItem, {
                product_id: id as string, quantity: 1
            });
            setHasError(false)
            toast({
                title: 'Item is added to cart',
                status: 'success',
                duration: 2500,
                isClosable: true,
            })
        } catch (e) {
            setHasError(true)
            toast({
                title: 'Item is already added in cart',
                status: 'info',
                duration: 2500,
                isClosable: true,
            })
            setResStatusMsg((e as ApiError).message);
        }
    }

    return (
        <Flex id="product" flexDir='column' alignItems='center' justifyItems='flex-start'
            width='100%' maxWidth='350px' height='300px' maxHeight='300px'
            padding='5px' border='2px solid white' borderRadius='5px' boxShadow='lg'>


            <Flex id="product-image" width='150px' height='120px'>
                <Image src={image} width='150px' maxWidth='150px' height='120px' maxHeight='120px' roundedTop="lg" ></Image>
            </Flex>

            <Flex id="product-info" width='300px' maxWidth='500px' height='40px' maxHeight='50px' flexDir='column' m='10px'>
                <Link to={id!}>  <Text noOfLines={2} fontSize={15} fontWeight='bold' >{name} </Text></Link>
            </Flex>

            <Flex id="product-controls" mt="1" justifyContent="space-between" alignContent="center">
                <Tooltip
                    label="Add to cart"
                    bg="white"
                    color={'gray.800'}
                    fontSize={'1.2em'}
                    placement='top'>
                    <chakra.button display={'flex'} cursor={stock === 0 ? "not-allowed" : "pointer"} disabled={stock === 0} onClick={async () => { await addToCart() }}>
                        <Icon as={stock === 0 ? BsCartX : FiShoppingCart} color={stock === 0 ? 'gray.100' : 'black'} h={7} w={7} alignSelf={'center'} />
                    </chakra.button>

                </Tooltip>
                <Box p='5' fontWeight='bold'> ${price} </Box>
                {/* {hasError && <Alert status='warning' m='2px'><AlertIcon /> {resStatusMsg || ERRORS.OUT_OF_STOCK} </Alert>} */}
            </Flex>


            {/* <Flex width='300px' maxWidth='500px' flexDir='column'>
                <Button disabled={stock === 0} onClick={async () => { await addToCart() }}>Add to Cart ${price}</Button>
            </Flex> */}
        </Flex >
    )
};