/**********************************
 * Walter Backend Proxy Endpoints *
 **********************************/

export const PROXY_ENDPOINTS: { [key: string]: { method: string; path: string } } = {
  LOGIN: { method: 'POST', path: '/auth/login' },
  REFRESH: { method: 'POST', path: '/auth/refresh' },
  LOGOUT: { method: 'POST', path: '/auth/logout' },
  GET_USER: { method: 'GET', path: '/users/get-user' },
  CREATE_USER: { method: 'POST', path: '/users/create-user' },
  GET_ACCOUNTS: { method: 'GET', path: '/accounts/get-accounts' },
  GET_TRANSACTIONS: { method: 'GET', path: '/transactions/get-transactions' },
  CREATE_LINK_TOKEN: {
    method: 'POST',
    path: '/plaid/create-link-token',
  },
  EXCHANGE_PUBLIC_TOKEN: {
    method: 'POST',
    path: '/plaid/exchange-public-token',
  },
  SYNC_TRANSACTIONS: {
    method: 'POST',
    path: '/plaid/sync-transactions',
  },
};
