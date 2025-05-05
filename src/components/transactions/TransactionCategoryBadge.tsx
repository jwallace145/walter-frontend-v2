import React from 'react';

const TransactionCategoryBadge: React.FC<{ category: string }> = ({
  category,
}): React.ReactElement => {
  switch (category.toLowerCase()) {
    case 'bills':
      return (
        <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700 ring-1 ring-orange-700/10 ring-inset">
          💰 Bills
        </span>
      );
    case 'entertainment':
      return (
        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-red-700/10 ring-inset">
          🎮 Entertainment
        </span>
      );
    case 'groceries':
      return (
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
          🛒 Groceries
        </span>
      );
    case 'health and wellness':
      return (
        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-700/10 ring-inset">
          ❤️ Health and Wellness
        </span>
      );
    case 'hobbies':
      return (
        <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-0.5 text-xs font-medium text-pink-700 ring-1 ring-pink-700/10 ring-inset">
          🎨 Hobbies
        </span>
      );
    case 'housing':
      return (
        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-purple-600/20 ring-inset">
          🏠 Housing
        </span>
      );
    case 'income':
      return (
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
          💵 Income
        </span>
      );
    case 'insurance':
      return (
        <span className="inline-flex items-center rounded-md bg-cyan-50 px-2 py-0.5 text-xs font-medium text-cyan-700 ring-1 ring-cyan-700/10 ring-inset">
          🛡️ Insurance
        </span>
      );
    case 'merchandise':
      return (
        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset">
          📦 Merchandise
        </span>
      );
    case 'restaurants':
      return (
        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-700/10 ring-inset">
          🍽️ Restaurants
        </span>
      );
    case 'shopping':
      return (
        <span className="inline-flex items-center rounded-md bg-fuchsia-50 px-2 py-0.5 text-xs font-medium text-fuchsia-700 ring-1 ring-fuchsia-700/10 ring-inset">
          🛍️ Shopping
        </span>
      );
    case 'subscriptions':
      return (
        <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-violet-700/10 ring-inset">
          📱 Subscriptions
        </span>
      );
    case 'transportation':
      return (
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
          🚗 Transportation
        </span>
      );
    case 'travel':
      return (
        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
          ✈️ Travel
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
          ❔ Other
        </span>
      );
  }
};

export default TransactionCategoryBadge;
