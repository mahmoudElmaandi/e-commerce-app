import { Button, Container, Text } from "@chakra-ui/react";
import {
    PaymentElement, useElements, useStripe
} from "@stripe/react-stripe-js";
import React, { useState } from "react";

export const CheckoutForm = () => {
    // https://stripe.com/docs/stripe-js/react#usestripe-hook
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:3000/order/status",
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message!);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <>
            <Container >

                <form id="payment-form" onSubmit={handleSubmit}>
                    <PaymentElement id="payment-element" />
                    <Button id="submit" type="submit" disabled={isLoading || !stripe || !elements} width='100%' m='10px'>
                        <span id="button-text">
                            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                        </span>
                    </Button>
                    {/* Show any error or success messages */}
                    {message && <Text id="payment-message">{message}</Text>}
                </form>
            </Container>
        </>
    );
}