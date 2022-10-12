import { Alert, AlertIcon, Button, Center, Container, FormControl, FormErrorMessage, Input, InputGroup, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { PasswordInput } from "../components/password-input";
import { isLoggedIn, singin } from "../fetch/auth";

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

        try {
            await singin(login, password);
            navigate('/user')
        } catch (error) {
            setHasError(true)
            setResError((error as Error).message);
        }
    };

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/user')
        }
    }, [navigate]);

    return (
        <Center height='100vh' bg={useColorModeValue('gray.50', 'gray.800')}>
            <Container maxW='md'  >
                <Stack spacing={4} boxShadow={'lg'} rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    p='10px'>
                    <Text as='b' fontSize='25px' align={'center'}>Sign in to your account</Text>

                    <FormControl isInvalid={login === ''}>
                        <InputGroup>
                            <Input type='text' name="login" placeholder='Username or Email' value={login} onChange={handleChange} />
                        </InputGroup>
                        {login ? "" : <FormErrorMessage>Username or Email is required.</FormErrorMessage>}
                    </FormControl>

                    <PasswordInput password={password} handleChange={handleChange}></PasswordInput>

                    {hasError ? <Alert status='warning'> <AlertIcon />{resError}</Alert> : ''}

                    <Button disabled={!login || !password} colorScheme='blue' onClick={async (e) => await handleSignUp(e)}>Sign In</Button>
                    <Text align={'center'}>Not a user ?< Link to='/signup'> <Text as='b' color='blue.800'>Sign up now</Text></Link></Text>

                </Stack>
            </Container >
        </Center>
    )
}