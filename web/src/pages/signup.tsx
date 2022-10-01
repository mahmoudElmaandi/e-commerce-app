import { EmailIcon } from "@chakra-ui/icons"
import { Alert, AlertIcon, Button, Container, Flex, Input, InputGroup, InputLeftElement, Stack } from "@chakra-ui/react"
import React, { useState } from "react";

import { ROOTENDPOINT } from "../env";

/**
Module not found: Error: You attempted to import ../../../server/endpoints which falls outside of the project src/ directory. Relative imports outside of src/ are not supported.
You can either move it inside src/, or add a symlink to it from project's node_modules/.
 */

// TODO: use CRACO @https://www.npmjs.com/package/@craco/craco/v/7.0.0-alpha.7
import { EndpointsConfigs } from "@ecommerce/shared";
import { useNavigate } from "react-router-dom";

import { PasswordInput } from "../components/password-input";

// TODO: check if user is already logged in
// TODO: extract password input to its own component

export const Signup = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');


    const handleChange = (e: React.SyntheticEvent) => {
        const name = (e.target as HTMLInputElement).name;
        const value = (e.target as HTMLInputElement).value;

        if (name === "username") setUsername(value)
        if (name === "email") setEmail(value)
        if (name === "password") setPassword(value)
    };

    const handleSignUp = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!username || !email || !password) {
            setHasError(true)
            setError('All fileds are required');
            return
        };

        setHasError(false)
        const response = await fetch(`${ROOTENDPOINT}${EndpointsConfigs.signup.url}`, {
            method: EndpointsConfigs.signup.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        await new Promise((resolve) => setTimeout(resolve, 500));
        const data = await response.json();
        console.log(data)

        if (response.status === 403) {
            setHasError(true)
            setError(data.error);
        };

        if (response.status === 200) {
            localStorage.setItem("jwt", data.jwt)
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
                    <Input type='text' name="username" placeholder='Username' value={username} onChange={handleChange} />
                </InputGroup>

                <InputGroup>
                    <InputLeftElement
                        pointerEvents='none'
                        children={<EmailIcon color='gray.300' />}
                    />
                    <Input type='email' name="email" placeholder='Email' value={email} onChange={handleChange} />
                </InputGroup>

                <PasswordInput password={password} handleChange={handleChange}></PasswordInput>

                <Button colorScheme='blue' onClick={async (e) => await handleSignUp(e)}>Sign Up</Button>
            </Stack>
        </Container>
    )
}