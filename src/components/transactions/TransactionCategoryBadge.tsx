import React from 'react';

type CategoryConfig = {
  emoji: string;
  text: string;
  bgColor: string;
  textColor: string;
  ringColor: string;
};

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  bills: {
    emoji: '💰',
    text: 'Bills',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    ringColor: 'ring-orange-700/10',
  },
  entertainment: {
    emoji: '🎮',
    text: 'Entertainment',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    ringColor: 'ring-red-700/10',
  },
  groceries: {
    emoji: '🛒',
    text: 'Groceries',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    ringColor: 'ring-yellow-600/20',
  },
  'health and wellness': {
    emoji: '❤️',
    text: 'Health and Wellness',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    ringColor: 'ring-emerald-700/10',
  },
  hobbies: {
    emoji: '🎨',
    text: 'Hobbies',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    ringColor: 'ring-pink-700/10',
  },
  housing: {
    emoji: '🏠',
    text: 'Housing',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    ringColor: 'ring-purple-600/20',
  },
  income: {
    emoji: '💵',
    text: 'Income',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    ringColor: 'ring-green-600/20',
  },
  insurance: {
    emoji: '🛡️',
    text: 'Insurance',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    ringColor: 'ring-cyan-700/10',
  },
  merchandise: {
    emoji: '📦',
    text: 'Merchandise',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    ringColor: 'ring-purple-700/10',
  },
  restaurants: {
    emoji: '🍽️',
    text: 'Restaurants',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    ringColor: 'ring-amber-700/10',
  },
  shopping: {
    emoji: '🛍️',
    text: 'Shopping',
    bgColor: 'bg-fuchsia-50',
    textColor: 'text-fuchsia-700',
    ringColor: 'ring-fuchsia-700/10',
  },
  subscriptions: {
    emoji: '📱',
    text: 'Subscriptions',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700',
    ringColor: 'ring-violet-700/10',
  },
  transportation: {
    emoji: '🚗',
    text: 'Transportation',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    ringColor: 'ring-blue-700/10',
  },
  travel: {
    emoji: '✈️',
    text: 'Travel',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    ringColor: 'ring-indigo-700/10',
  },
};

const TransactionCategoryBadge: React.FC<{ category: string }> = ({
  category,
}): React.ReactElement => {
  const config: CategoryConfig = CATEGORY_CONFIG[category.toLowerCase()] || {
    emoji: '❔',
    text: 'Other',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    ringColor: 'ring-gray-500/10',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md ${config.bgColor} px-2 py-0.5 text-xs font-medium ${config.textColor} ring-1 ${config.ringColor} ring-inset`}
    >
      <span className="sm:hidden">{config.emoji}</span>
      <span className="hidden sm:inline">{`${config.emoji} ${config.text}`}</span>
    </span>
  );
};

export default TransactionCategoryBadge;
