import {
    Elements
} from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import { CheckoutForm } from "../../components/checkout-form";
import { SucceededPayment } from './payment-success';
import { Error403 } from '../errors/403';

export const PaymentStatus = () => {
    const stripe = useOutletContext() as Stripe;
    console.log("useOutletContext", stripe);

    const [status, setStatus] = useState("");

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecretParam = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
    );

    useEffect(() => {
        console.log("PaymentStatus mounted")

        if (!stripe || !clientSecretParam) {
            return;
        }

        // Retrieve the PaymentIntent
        stripe
            .retrievePaymentIntent(clientSecretParam!)
            .then(({ paymentIntent }) => {
                // Inspect the PaymentIntent `status` to indicate the status of the payment
                // to your customer.
                //
                // Some payment methods will [immediately succeed or fail][0] upon
                // confirmation, while others will first enter a `processing` state.
                //
                // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
                setStatus(paymentIntent!.status)
                switch (paymentIntent!.status) {
                    case 'succeeded':
                        // setMessage('Success! Payment received.');
                        // navigate('/success')
                        break;

                    case 'processing':
                        // setMessage("Payment processing. We'll update you when payment is received.");
                        break;

                    case 'requires_payment_method':
                        // Redirect your user back to your payment page to attempt collecting
                        // payment again
                        // setMessage('Payment failed. Please try another payment method.');
                        break;

                    default:
                        // setMessage('Something went wrong.');
                        break;
                }
            });
    }, [clientSecretParam, stripe]);

    return (

        <>
            {
                stripe && clientSecretParam ?
                    <Elements key={clientSecretParam} options={{ clientSecret: clientSecretParam, appearance: { theme: "stripe" } }} stripe={stripe}>
                        {
                            status === "succeeded" ? <SucceededPayment clientSecret={clientSecretParam} ></SucceededPayment>
                                :
                                status === "requires_payment_method" ? <CheckoutForm />
                                    : status === "processing" ? "processing" : null
                        }
                    </Elements>
                    : <Error403 />
            }

        </>
    )
};
