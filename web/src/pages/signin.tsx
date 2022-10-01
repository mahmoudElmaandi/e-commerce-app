import { ViewIcon, ViewOffIcon, } from "@chakra-ui/icons"
import { Alert, AlertIcon, Button, Container, FormControl, FormErrorMessage, Input, InputGroup, InputRightElement, Stack } from "@chakra-ui/react"
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
    const [resError, setResError] = useState('');


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
            setResError("wrong credentials");
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

                <FormControl isInvalid={login === ''}>
                    <InputGroup>
                        <Input type='text' name="login" placeholder='Username or Email' value={login} onChange={handleChange} />
                    </InputGroup>
                    {login ? "" : <FormErrorMessage>Username or Email is required.</FormErrorMessage>}
                </FormControl>

                <PasswordInput password={password} handleChange={handleChange}></PasswordInput>

                {hasError ? <Alert status='warning'> <AlertIcon />{resError}</Alert> : ''}

                <Button disabled={!login || !password} colorScheme='blue' onClick={async (e) => await handleSignUp(e)}>Sign In</Button>
            </Stack>
        </Container >
    )
}