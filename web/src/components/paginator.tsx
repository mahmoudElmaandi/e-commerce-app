import { Button, Flex } from "@chakra-ui/react";
import { Pagination } from "@ecommerce/shared/src/api";

export const Paginator: React.FC<{ pagination: Pagination, changePaginationParams: Function, isPreviousData: boolean }> = ({ pagination, changePaginationParams, isPreviousData }) => {
    const { currentPage, pageSize, total } = pagination;
    const pageCount = Math.ceil(total / pageSize);

    let paginationItems = [];

    for (let i = 1; i <= pageCount; i++) {
        paginationItems.push({ isActive: i === currentPage ? true : false, page: i })
    }

    const handleClick = async (event: any) => {
        changePaginationParams(event.target.tabIndex, pageSize)
    };

    return (
        <Flex gap='5px' flexDir='row' justify='center' margin='10px' flexWrap='wrap'>
            {
                paginationItems.map(item =>
                    <Button tabIndex={item.page} key={item.page} onClick={handleClick} colorScheme={item.isActive ? 'blue' : 'gray'}>
                        {/* disabled={isPreviousData} */}
                        {item.page}
                    </Button>
                )
            }
        </Flex>
    );
}