import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EndpointsConfigs, GetProductResponse } from '@ecommerce/shared';

import './index.css';
import { SingleProductCard } from './components/single-product-card';
import { callEndpoint } from './fetch';
import { Root } from './layouts/root';
import Error404 from './pages/errors/404';
import { ListCartItems } from './pages/list-cart-items';
import { ListOrdersItems } from './pages/list-order-items';
import { ListProducts } from './pages/list-products';
import { CheckOut } from './pages/payment/payment-checkout';
import { PaymentStatus } from './pages/payment/payment-status';
import { SucceededPayment } from './pages/payment/payment-success';
import { Signin } from './pages/signin';
import { Signup } from './pages/signup';


// https://reactrouter.com/en/main/routers/create-browser-router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: 'products', element: <ListProducts /> },
      {
        path: 'products/:productId', element: <SingleProductCard />,
        // https://reactrouter.com/en/main/route/loader
        loader: async ({ params }) => {
          return callEndpoint<any, GetProductResponse>(EndpointsConfigs.getProduct, Request, [],
            { paramKey: 'id', paramValue: params.productId! })
        }
      },
      { path: 'cart', element: <ListCartItems /> },
      { path: 'cart/checkout', element: < CheckOut /> },
      { path: 'orders', element: <ListOrdersItems /> },
      { path: 'order/status', element: <PaymentStatus /> },
      { path: '/success', element: < SucceededPayment clientSecret='' /> },
    ]
  },
  { path: 'signup', element: <Signup /> },
  { path: 'signin', element: <Signin /> }
]);

// Create a client
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <QueryClientProvider client={queryClient} >
        <RouterProvider router={router} />
      </ QueryClientProvider >
    </ChakraProvider>
  </React.StrictMode >
);

