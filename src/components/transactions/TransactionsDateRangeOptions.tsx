import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';
import dayjs from 'dayjs';
import React, { ReactElement, useEffect, useState } from 'react';

interface DateRange {
  id: number;
  name: string;
}

const THIS_MONTH: DateRange = {
  id: 1,
  name: 'This Month',
};

const LAST_MONTH: DateRange = {
  id: 2,
  name: 'Last Month',
};

const LAST_90_DAYS: DateRange = {
  id: 3,
  name: 'Last 90 Days',
};

const LAST_YEAR: DateRange = {
  id: 4,
  name: 'Last Year',
};

const DATE_RANGES: DateRange[] = [THIS_MONTH, LAST_MONTH, LAST_90_DAYS, LAST_YEAR];

const TransactionsDateRangeOptions: React.FC<{
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
}> = ({ setStartDate, setEndDate }): ReactElement => {
  const [selectedDateRange, setSelectedDateRange] = useState(THIS_MONTH);

  useEffect((): void => {
    switch (selectedDateRange.id) {
      case 1:
        setStartDate(dayjs().startOf('month').format('YYYY-MM-DD'));
        setEndDate(dayjs().endOf('month').format('YYYY-MM-DD'));
        break;
      case 2:
        setStartDate(dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'));
        setEndDate(dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'));
        break;
      case 3:
        setStartDate(dayjs().subtract(90, 'day').format('YYYY-MM-DD'));
        setEndDate(dayjs().format('YYYY-MM-DD'));
        break;
      case 4:
        setStartDate(dayjs().subtract(1, 'year').format('YYYY-MM-DD'));
        setEndDate(dayjs().format('YYYY-MM-DD'));
        break;
    }
  }, [selectedDateRange]);

  return (
    <Listbox value={selectedDateRange} onChange={setSelectedDateRange}>
      <div className="relative mt-2">
        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-2 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
          <span className="col-start-1 row-start-1 truncate pr-6">{selectedDateRange.name}</span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
        >
          {DATE_RANGES.map(
            (range: DateRange): ReactElement => (
              <ListboxOption
                key={range.id}
                value={range}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
              >
                <span className="block truncate font-normal group-data-selected:font-semibold">
                  {range.name}
                </span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span>
              </ListboxOption>
            )
          )}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

export default TransactionsDateRangeOptions;
