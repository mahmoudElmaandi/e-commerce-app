import { ViewIcon, ViewOffIcon, } from "@chakra-ui/icons"
import { Alert, AlertIcon, Button, Container, Input, InputGroup, InputRightElement, Stack } from "@chakra-ui/react"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROOTENDPOINT } from "../env";
import { EndpointsConfigs } from "@ecommerce/shared";
import { PasswordInput } from "../components/password-input";

// TODO: check if user is already logged in
export const Signin = () => {
    const navigate = useNavigate();

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');


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

        const response = await fetch(`${ROOTENDPOINT}${EndpointsConfigs.signin.url}`, {
            method: EndpointsConfigs.signin.method,
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

                <PasswordInput password={password} handleChange={handleChange}></PasswordInput>

                <Button colorScheme='blue' onClick={async (e) => await handleSignUp(e)}>Sign In</Button>
            </Stack>
        </Container>
    )
}