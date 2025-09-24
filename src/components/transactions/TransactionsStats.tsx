type TransactionsStatsProps = {
  totalIncome: number;
  totalExpenses: number;
  cashFlow: number;
  title?: string;
};

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export default function TransactionsStats({
  totalIncome,
  totalExpenses,
  cashFlow,
  title,
}: TransactionsStatsProps) {
  const stats = [
    { name: 'Total Income', stat: formatCurrency(totalIncome) },
    { name: 'Total Expenses', stat: formatCurrency(totalExpenses) },
    { name: 'Cash Flow', stat: formatCurrency(cashFlow) },
  ];

  return (
    <div>
      {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {item.stat}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
