
import { Box, Heading, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useEffect } from 'react'
import { isLoggedIn } from '../../fetch/auth';
import { useNavigate } from 'react-router-dom';
import { Error403 } from '../errors/403';

export const SucceededPayment: React.FC<{ clientSecret: string }> = ({ clientSecret }) => {

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/signin')
        }

        if (!clientSecret) {
            return
        }
    })

    return (
        clientSecret ?
            <Box textAlign="center" py={10} px={6}>
                <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    Success! Payment received.
                    <br></br>
                    Thanks for your order!
                </Heading>
                <Text color={'gray.500'}>
                    You can check you order details here
                </Text>
            </Box>
            : <Error403 />

    );
};