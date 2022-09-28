import { Product } from "../../../server/types";

import { Box, Flex, Image, Text } from "@chakra-ui/react"


export const ProductSearchResultCard: React.FC<{ product: Product }> = ({ product }) => {
    const { name, des, image, price, sku } = product;
    return (
        <Flex id="product" flexDir='row' alignItems='center' >

            <Flex id="product-left" width='150px' height='120px'>
                <Image src={image} width='150px' maxWidth='150px' ></Image>
            </Flex>

            <Flex id="product-right" flexDir='column' m='10px' backgroundColor='beige'>
                <Text fontSize={15} fontWeight='bold' >{name} </Text>
                <Text fontSize={25} >{des} </Text>
            </Flex>

        </Flex >
    )
};