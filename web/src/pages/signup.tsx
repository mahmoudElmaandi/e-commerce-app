import { EmailIcon, PhoneIcon, ViewIcon, ViewOffIcon, } from "@chakra-ui/icons"
import { Alert, AlertIcon, Button, Container, Flex, Input, InputGroup, InputLeftElement, InputRightElement, Stack } from "@chakra-ui/react"
import React, { useState } from "react";

import { ROOTENDPOINT } from "../env";

/**
Module not found: Error: You attempted to import ../../../server/endpoints which falls outside of the project src/ directory. Relative imports outside of src/ are not supported.
You can either move it inside src/, or add a symlink to it from project's node_modules/.
 */

// TODO: use CRACO @https://github.com/dilanx/craco
import { EndpointsConfigs } from "../../../server/endpoints";
import { useNavigate } from "react-router-dom";


// TODO: check if user is already logged in
// TODO: extract password input to its own component

export const Signup = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)

    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');

    const handleClick = () => setShow(!show)

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
        const response = await fetch(`${ROOTENDPOINT}/api/v1/signup`, { //EndpointsConfigs.signup.url
            method: 'POST', //  EndpointsConfigs.signup.method
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

                <Button colorScheme='blue' onClick={async (e) => await handleSignUp(e)}>Sign Up</Button>
            </Stack>
        </Container>
    )
}