import { DeleteIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Flex, IconButton, Image, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from "@chakra-ui/react";
import { deleteCartItemRequest, deleteCartItemResponse, EndpointsConfigs, ProductCartItem, updateCartItemQuantityRequest, updateCartItemQuantityResponse } from "@ecommerce/shared";
import React, { useCallback, useState } from "react";
import { ApiError, callEndpoint } from "../fetch";

export const ProductCartItemCard: React.FC<{ productCartItem: ProductCartItem, refetchCartItems: Function }> = ({ productCartItem, refetchCartItems }) => {
    const { product_id, cart_item_id, name, price, quantity: comingQuantity, image, stock } = productCartItem;

    console.log('productCartItem', productCartItem)
    console.log('cartItem_id', cart_item_id)

    const [quantity, setQuantity] = useState(comingQuantity)
    const [hasError, setHasError] = useState(false);
    const [resError, setResError] = useState('');

    const updateQuantity = async (newQuantity: number) => {
        console.log('quantity', quantity)
        console.log('cart_item_id', cart_item_id)

        try {
            await callEndpoint<updateCartItemQuantityRequest, updateCartItemQuantityResponse>(EndpointsConfigs.updateCartItemQuantity, {
                productId: product_id, itemId: cart_item_id, quantity: newQuantity
            });

            setHasError(false)
            setQuantity(newQuantity)

            // navigate(ROUTES.HOME);
        } catch (e) {
            setHasError(true)
            setResError((e as ApiError).message);
        }
    };

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

        <Flex id="product" alignItems='center'  >

            <Flex id="cart-item-left" width='150px' height='120px'>
                <Image src={image} width='150px' maxWidth='150px' ></Image>
            </Flex>

            <Flex id="cart-item-right" flexDir='column' m='10px' >
                <Text fontSize={15} fontWeight='bold' >{name} </Text>
                <Text fontSize={25} >Stock : {stock} </Text>
                {hasError ? <Alert status='warning'><AlertIcon /> {resError} </Alert> : ''}
            </Flex>

            <Flex id="cart-item-right" gap='5px' flexDir='row' m='10px'>

                <IconButton
                    onClick={async () => { await deleteCartItem(cart_item_id) }}
                    colorScheme='red'
                    aria-label='Call Segun'
                    size='lg'
                    icon={<DeleteIcon />}
                />

                <NumberInput size='lg' maxW={32} value={quantity} min={1} max={stock} onChange={async (_, newQuantity) => await updateQuantity(newQuantity)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Flex>

        </Flex >

    )
};