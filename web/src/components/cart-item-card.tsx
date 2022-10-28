import { Alert, AlertIcon, Box, CloseButton, Flex, Image, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { deleteCartItemRequest, deleteCartItemResponse, EndpointsConfigs, ProductCartItem, updateCartItemQuantityRequest, updateCartItemQuantityResponse } from "@ecommerce/shared";
import React, { useCallback, useState } from "react";
import { ApiError, callEndpoint } from "../fetch";

export const ProductCartItemCard: React.FC<{ productCartItem: ProductCartItem, refetchCartItems: Function }> = ({ productCartItem, refetchCartItems }) => {
    const { product_id, cart_item_id, name, price, quantity: comingQuantity, image, stock } = productCartItem;

    // console.log('productCartItem', productCartItem)
    // console.log('cartItem_id', cart_item_id)

    const [quantity, setQuantity] = useState(comingQuantity)
    const [hasError, setHasError] = useState(false);
    const [resError, setResError] = useState('');

    const updateQuantity = useCallback(async (newQuantity: number) => {
        try {
            await callEndpoint<updateCartItemQuantityRequest, updateCartItemQuantityResponse>(EndpointsConfigs.updateCartItemQuantity, {
                productId: product_id, itemId: cart_item_id, quantity: newQuantity
            });

            setHasError(false)
            setQuantity(newQuantity)
            refetchCartItems();
            // navigate(ROUTES.HOME);
        } catch (e) {
            setHasError(true)
            setResError((e as ApiError).message);
        }
    }, [refetchCartItems])

    const deleteCartItem = useCallback(async (itemId: string) => {

        try {
            await callEndpoint<deleteCartItemRequest, deleteCartItemResponse>(EndpointsConfigs.deleteCartItem, {
                itemId
            });
            setHasError(false)
            refetchCartItems();
        } catch (e) {
            setHasError(true)
            setResError((e as ApiError).message);
        }
    }, [refetchCartItems])



    return (
        <Flex direction={{ base: 'row', md: 'row' }} align="center">

            <Stack direction="row" spacing="5" width={{ base: 'md', md: 'md', sm: 'sm' }} display={{ base: 'block', md: 'flex' }} >
                <Image
                    rounded="lg"
                    width="120px"
                    height="120px"
                    fit="cover"
                    src={image}
                    alt={name}
                    draggable="false"
                    loading="lazy"
                />
                <Box pt="4">
                    <Stack spacing="0.5">
                        <Text noOfLines={[1, 2, 3]} fontWeight="medium">{name}</Text>
                        <Text as="span" width='70px' fontWeight="semibold" color={useColorModeValue('gray.800', 'gray.100')}>
                            ${Number(price).toFixed(2)}
                        </Text>
                        {hasError ? <Alert status='warning'><AlertIcon /> {resError} </Alert> : ''}
                    </Stack>
                </Box>
            </Stack>

            <Flex gap='2' align='center' justify="center" display={{ base: 'flex', md: 'flex' }}>

                <NumberInput size='lg' maxW={32} value={quantity} min={1} max={stock} onChange={async (_, newQuantity) => await updateQuantity(newQuantity)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>


                <CloseButton aria-label={`Delete ${name} from cart`} _hover={{ background: 'red', color: 'white' }} onClick={async () => { await deleteCartItem(cart_item_id) }} />

            </Flex>

        </Flex>
    )
};