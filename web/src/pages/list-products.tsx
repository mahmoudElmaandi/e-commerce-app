import React, { useState } from "react";
import { useQuery } from 'react-query';
import { Product } from "@ecommerce/shared";
import { ProductCard } from '../components/product-card';
import { Box, Flex, Image, Text, Link, Button, Stack, Skeleton } from "@chakra-ui/react"
import { Paginator } from "../components/paginator";
import {
    NavLink,
    Outlet,
    useSearchParams,
} from "react-router-dom";

import { ROOTENDPOINT } from "../env";
import { getLocalStorageJWT } from "../fetch/auth";
export const ListProducts = () => {
    let [searchParams, setSearchParams] = useSearchParams();

    const page: number = parseInt(searchParams.get("page") || "1");
    const pageSize: number = parseInt(searchParams.get("pageSize") || "10");

    const fetchPost = async (endpoint: string) => {

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${getLocalStorageJWT()}`
            },
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
        return response.json();
    }

    const ENDPOINT = `${ROOTENDPOINT}/api/v1/products?page=${page}&pageSize=${pageSize}`;

    let { isLoading, isError, data, error } = useQuery(['listposts'], () => fetchPost(ENDPOINT))

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
        return <span>Error: Couldn't load products</span>
    }

    const { products, pagination } = data

    return (
        <>

            <Flex gap='2px' marginTop='10px' flexDir='row' align='flex-start' justify='center' flexWrap='wrap'>
                {
                    products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} ></ProductCard>
                    ))
                }
                {
                    products.lenght === 0 && 'No Products'
                }
            </Flex>

            {/* <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                // onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pagination["noPages"]}
                previousLabel="< previous"
            // renderOnZeroPageCount={null}
            /> */}
            <Paginator refetch={setSearchParams} pagination={{ currentPage: page, pageSize, total: pagination["total"] }}  ></Paginator>
        </>
    )
}