import { createPaymentIntentRequest, createPaymentIntentResponse, EndpointsConfigs } from "@ecommerce/shared";
import { Elements } from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CheckoutForm } from "../../components/checkout-form";
import { callEndpoint } from "../../fetch";


export const CheckOut = () => {

    const [clientSecret, setClientSecret] = useState("");

    const stripe = useOutletContext() as Stripe;
    console.log("useOutletContext", stripe);

    useEffect(() => {
        callEndpoint<createPaymentIntentRequest, createPaymentIntentResponse>(EndpointsConfigs.createPaymentIntent)
            .then((data) => setClientSecret(data.clientSecret));
    }, [stripe]);

    return (
        <>
            {clientSecret && (
                // passing the client secret obtained from the server
                // https://stackoverflow.com/questions/70864433/integration-of-stripe-paymentelement-warning-unsupported-prop-change-options-c
                <Elements key={clientSecret} options={{ clientSecret, appearance: { theme: "stripe" } }} stripe={stripe}>
                    <CheckoutForm />
                </Elements>
            )}
        </>
    );
}