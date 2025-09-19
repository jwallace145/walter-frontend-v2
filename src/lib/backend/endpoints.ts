/********************************
 * Walter Backend API Endpoints *
 ********************************/

export const ENDPOINTS: { [key: string]: { method: string; path: string; proxy: string } } = {
  LOGIN: { method: 'POST', path: '/auth/login', proxy: '/auth/login' },
  REFRESH: { method: 'POST', path: '/auth/refresh', proxy: '/auth/refresh' },
  LOGOUT: { method: 'POST', path: '/auth/logout', proxy: '/auth/logout' },
  GET_USER: { method: 'GET', path: '/users', proxy: '/users/get-user' },
  CREATE_USER: { method: 'POST', path: '/users', proxy: '/users/create-user' },
  CREATE_LINK_TOKEN: {
    method: 'POST',
    path: '/plaid/create-link-token',
    proxy: '/plaid/create-link-token',
  },
  EXCHANGE_PUBLIC_TOKEN: {
    method: 'POST',
    path: '/plaid/exchange-public-token',
    proxy: '/plaid/exchange-public-token',
  },
};
