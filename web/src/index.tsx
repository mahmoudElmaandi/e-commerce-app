import React, { useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider
} from 'react-query';
import './index.css';

import { ChakraProvider } from '@chakra-ui/react';

import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { SingleProductCard } from './components/single-product-card';
import { Root } from './layouts/root';
import ErrorPage from './pages/error-page';
import { ListCartItems } from './pages/list-cart-items';
import { ListOrdersItems } from './pages/list-order-items';
import { ListProducts } from './pages/list-products';
import { SucceededPayment } from './pages/payment-success';
import { Signin } from './pages/signin';
import { Signup } from './pages/signup';
import { callEndpoint } from './fetch';
import { EndpointsConfigs, GetProductResponse } from '@ecommerce/shared';

// https://reactrouter.com/en/main/routers/create-browser-router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'products', element: <ListProducts /> },
      {
        path: 'products/:productId', element: <SingleProductCard />,
        loader: async ({ params }) => {
          return callEndpoint<any, GetProductResponse>(EndpointsConfigs.getProduct, Request, [],
            { paramKey: 'id', paramValue: params.productId! })
        }
      },
      { path: 'cart', element: <ListCartItems /> },
      { path: 'orders', element: <ListOrdersItems /> },
      { path: '/success', element: < SucceededPayment /> }
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

