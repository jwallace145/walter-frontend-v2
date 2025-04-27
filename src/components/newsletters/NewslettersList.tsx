import React, { ReactElement } from 'react';

import { Newsletter } from '@/lib/models/Newsletter';

const NewslettersList: React.FC<{ newsletters: Newsletter[] }> = ({
  newsletters,
}): ReactElement => {
  const getModelBadge: (model: string) => ReactElement = (model: string): ReactElement => {
    switch (model.toLowerCase()) {
      case 'meta: llama3.3 70b':
        return (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
            Llama 3.3 70B
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
            Other
          </span>
        );
    }
  };

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {newsletters.map(
        (newsletter: Newsletter): ReactElement => (
          <li key={newsletter.date} className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm/6 font-semibold text-gray-900">{newsletter.title}</p>
                {getModelBadge(newsletter.model)}
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                <p className="whitespace-nowrap">{newsletter.date}</p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <a
                href="#"
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:block"
              >
                View Newsletter
              </a>
            </div>
          </li>
        )
      )}
    </ul>
  );
};

export default NewslettersList;
