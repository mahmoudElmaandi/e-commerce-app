import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
    Avatar, Box, Button, Flex, HStack, IconButton, Link, Menu,
    MenuButton, MenuDivider, MenuItem, MenuList, Stack, Text, useDisclosure
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Link as Rlink, NavLink } from "react-router-dom";

const Links = [
    ['Products', '/products'],
    ['Cart', '/cart'],
    ['Orders', '/orders']
];

const RNavLink = ({ url, children }: { url: string, children: ReactNode }) => (
    <NavLink to={url}  >
        {({ isActive }) => (
            (<Link backgroundColor={isActive ? 'blue.700' : ''} color={isActive ? 'white' : 'black'} as={Text} px={2} py={1} rounded={'md'}
                _hover={{ textDecoration: 'none', bg: isActive ? 'blue.400' : 'gray.200' }}> {children}   </Link>)
        )}
    </NavLink >
);

export const NavBar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box bg='white' px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>E-Commerce</Box>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}>
                            {Links.map(([name, url]) => (
                                <RNavLink key={name} url={url}>{name}</RNavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}>
                                <Avatar
                                    size={'sm'}
                                    src={""}
                                />
                            </MenuButton>
                            <MenuList>
                                <MenuItem>Link 1</MenuItem>
                                <MenuItem>Link 2</MenuItem>
                                <MenuDivider />
                                <MenuItem>Link 3</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map(([name, url]) => (
                                <RNavLink key={name} url={url}>{name}</RNavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}