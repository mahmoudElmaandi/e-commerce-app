import { Flex, Image, Text } from "@chakra-ui/react"
import { ProductOrderItem } from "@ecommerce/shared"
import React from "react"

export const ProductOrderItemCard: React.FC<{ productOrderitem: ProductOrderItem }> = ({ productOrderitem }) => {
    const { id, product_id, order_id, name, quantity, image, createdat } = productOrderitem;

    return (
        <Flex id="order" alignItems='center' width='40%' border='2px solid white' borderRadius='5px' boxShadow='lg'  >

            <Flex id="order-item-left" width='150px' height='120px'>
                <Image src={image} width='150px' maxWidth='150px' ></Image>
            </Flex>

            <Flex id="order-item-right" flexDir='column' m='10px' >
                <Text fontSize={15} fontWeight='bold' >{name} </Text>
                <Text fontSize={25} >Quantity : {quantity} </Text>
                <Text fontSize={25} >Orderd At : {new Date(createdat).toLocaleDateString()} </Text>
            </Flex>
        </Flex >
    )
}
