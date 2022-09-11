export type EndpointConfig = { url: string; method: 'get' | 'post' | 'put' | 'delete' };

export enum Endpoints {
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

  [Endpoints.listProducts]: { method: 'get', url: '/api/v1/products' },
  [Endpoints.getProduct]: { method: 'get', url: '/api/v1/products/:id' },
  [Endpoints.createProduct]: { method: 'post', url: '/api/v1/products' },
  [Endpoints.deleteProduct]: { method: 'delete', url: '/api/v1/products/:id' },

  [Endpoints.listCategories]: { method: 'get', url: '/api/v1/categories' },
  [Endpoints.getCategory]: { method: 'get', url: '/api/v1/categories/:id' },
  [Endpoints.createCategroy]: { method: 'post', url: '/api/v1/categories' },
  [Endpoints.deleteCategroy]: { method: 'delete', url: '/api/v1/categories' }
};
