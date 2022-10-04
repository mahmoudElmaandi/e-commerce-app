const APIVER = 'v1';

export type EndpointConfig = { url: string; method: 'get' | 'post' | 'put' | 'delete'; authenticated?: boolean; authorized?: boolean };

export enum Endpoints {
  signup = 'signup',
  signin = 'signin',

  listProducts = 'listProducts',
  createProduct = 'createProduct',
  getProduct = 'getProduct',
  deleteProduct = 'deleteProduct',

  listCategories = 'listCategories',
  getCategory = 'getCategory',
  createCategroy = 'createCategroy',
  deleteCategroy = 'deleteCategroy',

  listCartItems = 'listCartItems',
  addCartItem = 'addCartItem',
  updateCartItemQuantity = 'updateCartItemQuantity',
  deleteCartItem = 'deleteCartItem',

}

export const EndpointsConfigs: { [key in Endpoints]: EndpointConfig } = {

  [Endpoints.signup]: { method: 'post', url: `/api/${APIVER}/signup` },
  [Endpoints.signin]: { method: 'post', url: `/api/${APIVER}/signin` },

  [Endpoints.listProducts]: { method: 'get', url: `/api/${APIVER}/products`, authenticated: true },
  [Endpoints.getProduct]: { method: 'get', url: `/api/${APIVER}/products/:id` },
  [Endpoints.createProduct]: { method: 'post', url: `/api/${APIVER}/products`, authenticated: true, authorized: true },
  [Endpoints.deleteProduct]: { method: 'delete', url: `/api/${APIVER}/products/:id`, authenticated: true, authorized: true },

  [Endpoints.listCategories]: { method: 'get', url: `/api/${APIVER}/categories` },
  [Endpoints.getCategory]: { method: 'get', url: `/api/${APIVER}/categories/:id` },
  [Endpoints.createCategroy]: { method: 'post', url: `/api/${APIVER}/categories`, authenticated: true, authorized: true },
  [Endpoints.deleteCategroy]: { method: 'delete', url: `/api/${APIVER}/categories`, authenticated: true, authorized: true },

  [Endpoints.listCartItems]: { method: 'get', url: `/api/${APIVER}/carts/listitems`, authenticated: true },
  [Endpoints.addCartItem]: { method: 'post', url: `/api/${APIVER}/carts/additem`, authenticated: true },
  [Endpoints.updateCartItemQuantity]: { method: 'put', url: `/api/${APIVER}/carts/updateitem`, authenticated: true },
  [Endpoints.deleteCartItem]: { method: 'delete', url: `/api/${APIVER}/carts/deleteitem`, authenticated: true }

};
