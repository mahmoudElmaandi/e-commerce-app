import { EmailIcon } from "@chakra-ui/icons"
import { Alert, AlertIcon, Button, Container, Flex, FormControl, FormErrorMessage, FormHelperText, Input, InputGroup, InputLeftElement, Stack } from "@chakra-ui/react"
import React, { useEffect, useState } from "react";

import { ROOTENDPOINT } from "../env";

/**
Module not found: Error: You attempted to import ../../../server/endpoints which falls outside of the project src/ directory. Relative imports outside of src/ are not supported.
You can either move it inside src/, or add a symlink to it from project's node_modules/.
 */

// TODO: use CRACO @https://www.npmjs.com/package/@craco/craco/v/7.0.0-alpha.7
import { EndpointsConfigs } from "@ecommerce/shared";
import { useNavigate } from "react-router-dom";

import { PasswordInput } from "../components/password-input";
import { isLoggedIn, singup } from "../fetch/auth";

// TODO: check if user is already logged in
// TODO: extract password input to its own component

export const Signup = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const [hasError, setHasError] = useState(false);
    const [resError, setResError] = useState('');


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
            return
        };

        setHasError(false);

        try {
            await singup(username, email, password)
            navigate('/products')
        } catch (error) {
            setHasError(true)
            setResError((error as Error).message);
        }
    };

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/products')
        }
    }, [navigate]);

    return (
        <Container maxW='md' color='black'>
            <Stack spacing={4}>

                <FormControl isInvalid={username === ''}>
                    <InputGroup>
                        <Input isRequired={true} type='text' name="username" placeholder='Username' value={username} onChange={handleChange} />
                    </InputGroup>
                    {username ? "" : <FormErrorMessage>Username is required.</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={email === ''}>
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents='none'
                            children={<EmailIcon color='gray.300' />}
                        />
                        <Input isRequired={true} type='email' name="email" placeholder='Email' value={email} onChange={handleChange} />
                    </InputGroup>
                    {email ? "" : <FormErrorMessage>Email is required.</FormErrorMessage>}
                </FormControl>

                <PasswordInput password={password} handleChange={handleChange}></PasswordInput>

                {hasError ? <Alert status='warning'><AlertIcon /> {resError} </Alert> : ''}

                <Button disabled={!username || !email || !password} colorScheme='blue' onClick={async (e) => await handleSignUp(e)}>Sign Up</Button>
            </Stack>
        </Container >
    )
}