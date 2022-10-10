import { Flex, Skeleton } from "@chakra-ui/react";
import { EndpointsConfigs, ListProductsRequest, ListProductsResponse, Product } from "@ecommerce/shared";
import { useEffect, useState } from "react";
import { useQuery } from 'react-query';
import { useSearchParams } from "react-router-dom";
import { Paginator } from "../components/paginator";
import { ProductCard } from '../components/product-card';

import { ROOTENDPOINT } from "../env";
import { callEndpoint } from "../fetch";

export const ListProducts = () => {
    let [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(parseInt(searchParams.get("page")!) || 1);
    const [pageSize, setPageSize] = useState(parseInt(searchParams.get("pageSize")!) || 10);

    // let { isLoading, isError, data, error, refetch: refetchProducts } = useQuery(['listposts'], () =>
    //     callEndpoint<ListProductsRequest, ListProductsResponse>(EndpointsConfigs.listProducts, Request, [
    //         { paramKey: 'page', paramValue: pages.toString() },
    //         { paramKey: 'pageSize', paramValue: pageSizes.toString() }
    //     ])
    // )

    // setProducts(response)

    const changePaginationParams = (page: number, pageSize: number) => {
        setPage(page)
        setPageSize(pageSize)
    }

    useEffect(() => {
        const response = async () => {
            return await callEndpoint<ListProductsRequest, ListProductsResponse>(EndpointsConfigs.listProducts, Request, [
                { paramKey: 'page', paramValue: page.toString() },
                { paramKey: 'pageSize', paramValue: pageSize.toString() }
            ]);
        }

        response().then(
            (res) => setProducts(res.products as never)
        )
    }, [page, pageSize]);

    // if (isLoading) {
    //     return (
    //         <>
    //             <Flex gap='10px' marginTop='10px' flexDir='row' align='flex-start' justify='center' flexWrap='wrap'>
    //                 <Skeleton width='350px' height='300px' borderRadius='13px' />
    //                 <Skeleton width='350px' height='300px' borderRadius='13px' />
    //                 <Skeleton width='350px' height='300px' borderRadius='13px' />
    //                 <Skeleton width='350px' height='300px' borderRadius='13px' />
    //                 <Skeleton width='350px' height='300px' borderRadius='13px' />
    //                 <Skeleton width='350px' height='300px' borderRadius='13px' />
    //                 <Skeleton width='350px' height='300px' borderRadius='13px' />
    //                 <Skeleton width='350px' height='300px' borderRadius='13px' />
    //             </Flex>
    //         </>
    //     )
    // }

    // if (isError) {
    //     return <span>Error: Couldn't load products</span>
    // }

    // const { products, pagination } = data as ListProductsResponse;

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
                pagination={{ currentPage: page, pageSize, total: 20 }} //pagination["total"]
                itemsLink={'products'}
            ></Paginator>
        </>
    )
}