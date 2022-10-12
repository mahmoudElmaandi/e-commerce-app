import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from '../components/nav-bar';


export const Root = () => {

    const [stripe, setStripe] = useState({} as Stripe);

    useEffect(() => {
        (async () => {
            // Make sure to call loadStripe outside of a component’s render to avoid
            // recreating the Stripe object on every render.
            // Ensuring Stripe.js is available everywhere
            const loadedStripe = await loadStripe(process.env.REACT_APP_STRIPE_PK!) as Stripe
            setStripe(loadedStripe)
        })()
    }, [])

    return (
        <>
            <NavBar />
            {
                // https://reactrouter.com/en/main/hooks/use-outlet-context

                !(Object.getPrototypeOf(stripe) === Object.prototype)
                && <Outlet context={stripe} />
            }
        </>
    )
}
