import { CheckIcon } from '@heroicons/react/20/solid';
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';

import UnauthenticatedPageLayout from '@/layouts/UnauthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';

const includedFeatures = [
  'Weekly newsletter with personalized AI insights',
  'Smart expense tracking and budgeting tools',
  'AI-powered investment updates and market news',
  'Retirement planning and simulation tools',
];

export default function Pricing(): ReactElement {
  const getContent: () => ReactElement = (): ReactElement => {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl sm:text-center">
            <h2 className="text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-6xl sm:text-balance">
              Newsletter Subscription
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-3xl font-semibold tracking-tight text-gray-900">
                Monthly Subscription
              </h3>
              <p className="mt-6 text-base/7 text-gray-600">
                Unlock Walter’s weekly AI-powered financial newsletter with insights tailored to
                your spending, investments, and the market news that matters. Billed monthly. No
                subscription, no insights.
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm/6 font-semibold text-indigo-600">
                  What’s included
                </h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6"
              >
                {includedFeatures.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0">
              <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-gray-900/5 ring-inset lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-semibold text-gray-600">Billed monthly</p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-semibold tracking-tight text-gray-900">$5</span>
                    <span className="text-sm/6 font-semibold tracking-wide text-gray-600">USD</span>
                  </p>
                  <a
                    href="#"
                    className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Subscribe
                  </a>
                  <p className="mt-6 text-xs/5 text-gray-600">Unsubscribe at any time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <UnauthenticatedPageLayout content={getContent()} />;
}

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: false,
});
