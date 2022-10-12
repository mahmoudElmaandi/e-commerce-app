import { Flex, Skeleton } from "@chakra-ui/react";
import { EndpointsConfigs, ListProductsRequest, ListProductsResponse, Product } from "@ecommerce/shared";
import { useState } from "react";
import { useQuery } from 'react-query';
import { useSearchParams } from "react-router-dom";
import { Paginator } from "../components/paginator";
import { ProductCard } from '../components/product-card';
import { callEndpoint } from "../fetch";

export const ListProducts = () => {
    let [searchParams, setSearchParams] = useSearchParams();

    const [page, setPage] = useState(searchParams.get("page")! || "1");
    const [pageSize, setPageSize] = useState(searchParams.get("pageSize")! || "10");

    // https://tanstack.com/query/v4/docs/guides/query-keys#if-your-query-function-depends-on-a-variable-include-it-in-your-query-key
    // https://tanstack.com/query/v4/docs/guides/paginated-queries

    let { isLoading, isError, data, error, isPreviousData } = useQuery(['listposts', page, pageSize], () =>
        callEndpoint<ListProductsRequest, ListProductsResponse>(EndpointsConfigs.listProducts, Request, [
            { paramKey: 'page', paramValue: page },
            { paramKey: 'pageSize', paramValue: pageSize }
        ]), { keepPreviousData: true }
    )

    const changePaginationParams = (page: string, pageSize: string) => {
        setSearchParams({ page: page, pageSize: pageSize })
        setPage(page)
        setPageSize(pageSize)
    }

    if (isLoading) {
        return (
            <>
                <Flex gap='10px' marginTop='10px' flexDir='row' align='flex-start' justify='center' flexWrap='wrap'>
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                    <Skeleton width='350px' height='300px' borderRadius='13px' />
                </Flex>
            </>
        )
    }

    if (isError) {
        return <span>Error: Couldn't load products</span>
    }

    const { products, pagination } = data as ListProductsResponse;

    return (
        <>
            <Flex gap='10px' margin='5px' marginTop='10px' flexDir='row' align='flex-start' justify='center' flexWrap='wrap'>
                {
                    products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} ></ProductCard>
                    ))
                }
                {products.length === 0 && 'No Products'}
            </Flex>

            <Paginator changePaginationParams={changePaginationParams}
                pagination={{ currentPage: parseInt(page), pageSize: parseInt(pageSize), total: pagination["total"] }}
                isPreviousData={isPreviousData}
            ></Paginator>
        </>
    )
}