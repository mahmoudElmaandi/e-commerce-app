import { ViewIcon, ViewOffIcon, } from "@chakra-ui/icons"
import { Alert, AlertIcon, Button, Container, Input, InputGroup, InputRightElement, Stack } from "@chakra-ui/react"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROOTENDPOINT } from "../env";

// TODO: check if user is already logged in
export const Signin = () => {
    const navigate = useNavigate();

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)

    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');

    const handleClick = () => setShow(!show)

    const handleChange = (e: React.SyntheticEvent) => {
        const name = (e.target as HTMLInputElement).name;
        const value = (e.target as HTMLInputElement).value;

        if (name === "login") setLogin(value)
        if (name === "password") setPassword(value)
    };

    const handleSignUp = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!login || !password) {
            setHasError(true)
            setError('All fileds are required');
            return
        };

        setHasError(false)

        const response = await fetch(`${ROOTENDPOINT}/api/v1/signin`, { //EndpointsConfigs.signin.url
            method: 'POST', //  EndpointsConfigs.signin.method
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password })
        });

        await new Promise((resolve) => setTimeout(resolve, 500));

        if (response.status === 403) {
            setHasError(true)
            setError("wrong credentials");
        };

        if (response.status === 200) {
            const { jwt } = await response.json();
            localStorage.setItem("jwt", jwt)
            navigate('/products')
        };
    };

    return (
        <Container maxW='md' color='black'>
            <Stack spacing={4}>
                {
                    hasError ? <Alert status='warning'>
                        <AlertIcon />
                        {error}
                    </Alert> : ''
                }

                <InputGroup>
                    <Input type='text' name="login" placeholder='Username' value={login} onChange={handleChange} />
                </InputGroup>

                <InputGroup size='sm'>
                    <Input pr='4.5rem' type={show ? 'text' : 'password'} placeholder='Enter password' size='sm'
                        name="password" value={password} onChange={handleChange} />

                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick} >
                            {show ? <ViewOffIcon color='gray.300' /> : <ViewIcon color='gray.300' />}
                            {show ? ' Hide ' : ' Show '}
                        </Button>
                    </InputRightElement>
                </InputGroup>

                <Button colorScheme='blue' onClick={async (e) => await handleSignUp(e)}>Sign In</Button>
            </Stack>
        </Container>
    )
}