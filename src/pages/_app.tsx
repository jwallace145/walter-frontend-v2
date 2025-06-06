import '../styles/globals.css';

import type { AppProps } from 'next/app';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return <Component {...pageProps} />;
}

export default MyApp;
