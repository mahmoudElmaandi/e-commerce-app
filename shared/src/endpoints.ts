const APIVER = 'v1';

export type EndpointConfig = { url: string; method: 'get' | 'post' | 'put' | 'delete' };

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
}

export const EndpointsConfigs: { [key in Endpoints]: EndpointConfig } = {

  [Endpoints.signup]: { method: 'post', url: `/api/${APIVER}/signup` },
  [Endpoints.signin]: { method: 'post', url: `/api/${APIVER}/signin` },

  [Endpoints.listProducts]: { method: 'get', url: `/api/${APIVER}/products` },
  [Endpoints.getProduct]: { method: 'get', url: `/api/${APIVER}/products/:id` },
  [Endpoints.createProduct]: { method: 'post', url: `/api/${APIVER}/products` },
  [Endpoints.deleteProduct]: { method: 'delete', url: `/api/${APIVER}/products/:id` },

  [Endpoints.listCategories]: { method: 'get', url: `/api/${APIVER}/categories` },
  [Endpoints.getCategory]: { method: 'get', url: `/api/${APIVER}/categories/:id` },
  [Endpoints.createCategroy]: { method: 'post', url: `/api/${APIVER}/categories` },
  [Endpoints.deleteCategroy]: { method: 'delete', url: `/api/${APIVER}/categories` }
};
