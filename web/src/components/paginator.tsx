import { Button, Flex } from "@chakra-ui/react";
import { Pagination } from "@ecommerce/shared/src/api";
import { Link as RRLink } from "react-router-dom";

export const Paginator: React.FC<{ pagination: Pagination, changePaginationParams: Function, itemsLink: string }> = ({ pagination, changePaginationParams, itemsLink }) => {
    const { currentPage, pageSize, total } = pagination;
    const pageCount = Math.ceil(total / pageSize);

    let paginationItems = [];

    for (let i = 1; i <= pageCount; i++) {
        paginationItems.push({ isActive: i === currentPage ? true : false, page: i, to: `/${itemsLink}?page=${i}&pageSize=${pageSize}` })
    }

    const handleClick = async (event: any) => {
        // console.log("event.target.tabIndex", event.target.tabIndex)
        changePaginationParams(parseInt(event.target.tabIndex), pageSize)
    };

    return (
        <Flex gap='5px' flexDir='row' justify='center' margin='10px'>
            {
                paginationItems.map(item =>
                    <RRLink to={item.to} key={item.page} onClick={handleClick}>
                        <Button tabIndex={item.page} colorScheme={item.isActive ? 'blue' : 'gray'}>
                            {item.page}
                        </Button>
                    </RRLink>
                )
            }
        </Flex>
    );
}