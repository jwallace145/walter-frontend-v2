/********************************
 * Walter Backend API Endpoints *
 ********************************/

export const API_ENDPOINTS: { [key: string]: { method: string; path: string } } = {
  LOGIN: { method: 'POST', path: '/auth/login' },
  REFRESH: { method: 'POST', path: '/auth/refresh' },
  LOGOUT: { method: 'POST', path: '/auth/logout' },
  GET_USER: { method: 'GET', path: '/users' },
  GET_ACCOUNTS: { method: 'GET', path: '/accounts' },
  GET_TRANSACTIONS: { method: 'GET', path: '/transactions' },
  CREATE_USER: { method: 'POST', path: '/users' },
  CREATE_LINK_TOKEN: {
    method: 'POST',
    path: '/plaid/create-link-token',
  },
  EXCHANGE_PUBLIC_TOKEN: {
    method: 'POST',
    path: '/plaid/exchange-public-token',
  },
};
