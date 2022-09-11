import React from "react";
import { Product } from "../../../types";
import { Box, Flex, Image, Text } from "@chakra-ui/react"

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { name, des, image, price, sku } = product;
    return (
        <Flex id="product" flexDir='column' alignItems='center' justifyItems={'flex-start'} flexWrap={'wrap'} >

            <Flex id="product-left" width='150px' height='120px'>
                <Image src={image} width='150px' maxWidth='150px' ></Image>
            </Flex>

            <Flex id="product-right" maxWidth={'500px'} flexDir='column' m='10px' backgroundColor='beige'>
                <Text fontSize={15} fontWeight='bold' >{name} </Text>
            </Flex>

        </Flex >
    )
};