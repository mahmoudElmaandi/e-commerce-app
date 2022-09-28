import { Button, Flex, Link as LinkCH } from "@chakra-ui/react";
import { Pagination } from "../../../server/api";
import { HOST } from "../env";
import { Link } from "react-router-dom";

export const Paginator: React.FC<{ pagination: Pagination, refetch: Function }> = ({ pagination, refetch }) => {
    const { currentPage, pageSize, total } = pagination;
    const pageCount = Math.ceil(total / pageSize);

    let paginationItems = [];

    for (let i = 1; i <= pageCount; i++) {
        paginationItems.push({ isActive: i === currentPage ? true : false, page: i, to: `/products?page=${i}&pageSize=${pageSize}` })
    }

    const handlePageClick = (event: any) => {
        console.log(event.target.tabIndex)
        refetch({ "page": event.target.tabIndex, "pageSize": pageSize })
    };

    return (
        <Flex gap={'2px'} flexDir='row' justify='center'>
            {
                paginationItems.map(item => <LinkCH key={item.page} href={item.to} target='_parent'  ><Button tabIndex={item.page} colorScheme={item.isActive ? 'blue' : 'gray'}> {item.page}</Button></LinkCH>)
            }
        </Flex>
    );
}