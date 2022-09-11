import React, { useState } from "react";
import { useQuery } from 'react-query';
import { Product } from "../../../types";
import { ProductCard } from '../components/product-card';
import { Box, Flex, Image, Text, Link, Button } from "@chakra-ui/react"
import ReactPaginate from 'react-paginate';

export const ListPosts = () => {
    // const [pageCount, setPageCount] = useState(0);

    const fetchPost = async () => {
        const response = await fetch(`http://localhost:3001/api/v1/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    }
    const { isLoading, isError, data, error } = useQuery(['listposts'], fetchPost)

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: Couldn't load products</span>
    }

    const { products, pagination } = data

    let paginationItems = []
    for (let i = 0; i < pagination["noPages"]; i++) {
        paginationItems.push({ index: i + 1, url: `http://localhost:3001/api/v1/products?page=${i + 1}` })
    }

    const handlePageClick = (event: Event) => {

    };


    return (
        <>
            <h1>Products</h1>

            <Flex gap={'2px'} flexDir='row' align='flex-start' justify='center' flexWrap='wrap'>
                {products?.map((product: Product) => (
                    <ProductCard key={product.id} product={product} ></ProductCard>
                ))}
            </Flex>

            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                // onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pagination["noPages"]}
                previousLabel="< previous"
            // renderOnZeroPageCount={null}
            />

            <Flex gap={'2px'} flexDir='row' justify='center'>
                {
                    paginationItems.map(item => <Link href={item.url} ><Button colorScheme='gray'> {item.index}</Button></Link>)
                }
            </Flex>
        </>
    )
}