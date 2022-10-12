import { Box, Flex, Image, Text } from "@chakra-ui/react"
import { ProductOrderItem } from "@ecommerce/shared"
import React from "react"

export const ProductOrderItemCard: React.FC<{ productOrderitem: ProductOrderItem }> = ({ productOrderitem }) => {
    const { id, product_id, order_id, name, quantity, image, createdat } = productOrderitem;

    return (
        <Box maxW='lg' maxH='xl' border='2px solid white' borderRadius='5px' boxShadow='lg' >
            <Flex id="order" width='fit-content' alignItems='center'   >

                <Flex id="order-item-left" height='120px'>
                    <Image src={image} fit='contain'  ></Image>
                </Flex>

                <Flex id="order-item-right" flexDir='column' m='10px' >
                    <Text fontSize={15} fontWeight='bold' >{name} </Text>
                    <Text fontSize={25} >Quantity : {quantity} </Text>
                    <Text fontSize={25} >Orderd At : {new Date(createdat).toLocaleDateString()} </Text>
                </Flex>
            </Flex >
        </Box>
    )
}
