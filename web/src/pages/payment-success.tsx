
import { Box, Heading, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

export const SucceededPayment = () => {
    return (
        <Box textAlign="center" py={10} px={6}>
            <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
            <Heading as="h2" size="xl" mt={6} mb={2}>
                Thanks for your order!
            </Heading>
            <Text color={'gray.500'}>
                You can check you order details here
            </Text>
        </Box>
    );
};