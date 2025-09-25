import React from 'react';

import { TransactionCategory } from '@/lib/models/transaction';

type Props = {
  // Raw category string coming from data (may have different casing or spacing)
  category: string | null | undefined;
  className?: string;
};

const baseClasses =
  'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset';

const categoryStyles: Record<
  TransactionCategory | 'Other',
  { bg: string; text: string; ring: string; emoji: string; label: string }
> = {
  [TransactionCategory.BILLS]: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    ring: 'ring-yellow-600/20',
    emoji: '🧾',
    label: TransactionCategory.BILLS,
  },
  [TransactionCategory.ENTERTAINMENT]: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    ring: 'ring-purple-600/20',
    emoji: '🎬',
    label: TransactionCategory.ENTERTAINMENT,
  },
  [TransactionCategory.GROCERIES]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    ring: 'ring-green-600/20',
    emoji: '🛒',
    label: TransactionCategory.GROCERIES,
  },
  [TransactionCategory.HEALTH_AND_WELLNESS]: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-rose-600/20',
    emoji: '🩺',
    label: TransactionCategory.HEALTH_AND_WELLNESS,
  },
  [TransactionCategory.HOBBIES]: {
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    ring: 'ring-pink-600/20',
    emoji: '🎨',
    label: TransactionCategory.HOBBIES,
  },
  [TransactionCategory.HOUSING]: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    ring: 'ring-orange-600/20',
    emoji: '🏠',
    label: TransactionCategory.HOUSING,
  },
  [TransactionCategory.INCOME]: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-600/20',
    emoji: '💰',
    label: TransactionCategory.INCOME,
  },
  [TransactionCategory.INSURANCE]: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    ring: 'ring-cyan-600/20',
    emoji: '🛡️',
    label: TransactionCategory.INSURANCE,
  },
  [TransactionCategory.MERCHANDISE]: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    ring: 'ring-sky-600/20',
    emoji: '🛍️',
    label: TransactionCategory.MERCHANDISE,
  },
  [TransactionCategory.RESTAURANTS]: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    ring: 'ring-red-600/20',
    emoji: '🍽️',
    label: TransactionCategory.RESTAURANTS,
  },
  [TransactionCategory.SHOPPING]: {
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-700',
    ring: 'ring-fuchsia-600/20',
    emoji: '🛒',
    label: TransactionCategory.SHOPPING,
  },
  [TransactionCategory.SUBSCRIPTIONS]: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    ring: 'ring-indigo-600/20',
    emoji: '🔁',
    label: TransactionCategory.SUBSCRIPTIONS,
  },
  [TransactionCategory.TRANSPORTATION]: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    ring: 'ring-teal-600/20',
    emoji: '🚗',
    label: TransactionCategory.TRANSPORTATION,
  },
  [TransactionCategory.TRAVEL]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    ring: 'ring-blue-600/20',
    emoji: '✈️',
    label: TransactionCategory.TRAVEL,
  },
  [TransactionCategory.INVESTMENT]: {
    bg: 'bg-lime-50',
    text: 'text-lime-700',
    ring: 'ring-lime-600/20',
    emoji: '📈',
    label: TransactionCategory.INVESTMENT,
  },
  Other: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    ring: 'ring-gray-500/10',
    emoji: '🏷️',
    label: 'Other',
  },
};

const normalize = (value: string | null | undefined): TransactionCategory | 'Other' => {
  if (!value) return 'Other';
  const v = value.trim().toLowerCase();

  // Match against enum values (human-friendly labels)
  for (const cat of Object.values(TransactionCategory)) {
    if (cat.toLowerCase() === v) return cat;
  }

  // Also try matching enum keys (e.g., "HEALTH_AND_WELLNESS")
  for (const [key, cat] of Object.entries(TransactionCategory)) {
    if (key.toLowerCase() === v || key.replaceAll('_', ' ').toLowerCase() === v) {
      return cat as TransactionCategory;
    }
  }

  return 'Other';
};

const TransactionCategoryBadge: React.FC<Props> = ({ category, className }) => {
  const cat = normalize(category);
  const { bg, text, ring, emoji, label } = categoryStyles[cat];
  return (
    <span className={`${baseClasses} ${bg} ${text} ${ring} ${className ?? ''}`.trim()}>
      <span aria-hidden="true">{emoji}</span>
      <span className="sr-only">Category:</span>
      <span>{label}</span>
    </span>
  );
};

export default TransactionCategoryBadge;
