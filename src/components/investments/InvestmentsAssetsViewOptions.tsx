import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';
import React from 'react';

export interface AssetViewOption {
  id: string;
  name: string;
  current: boolean;
}

const InvestmentsAssetsViewOptions: React.FC<{
  assetViewOption: AssetViewOption;
  setAssetViewOption: (assetViewOption: AssetViewOption) => void;
}> = ({ assetViewOption, setAssetViewOption }): React.ReactElement => {
  const getAssetViewOptions: () => AssetViewOption[] = (): AssetViewOption[] => {
    return [
      { id: 'equity', name: 'Equity', current: assetViewOption.name.toLowerCase() === 'equity' },
      { id: 'shares', name: 'Shares', current: assetViewOption.name.toLowerCase() === 'shares' },
      { id: 'price', name: 'Price', current: assetViewOption.name.toLowerCase() === 'price' },
    ];
  };

  return (
    <nav className="flex overflow-x-auto py-4">
      {/* Mobile List Options */}
      <div className="w-full sm:hidden">
        <Listbox value={assetViewOption} onChange={setAssetViewOption}>
          <div className="relative mt-2">
            <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
              <span className="col-start-1 row-start-1 truncate pr-6">{assetViewOption.name}</span>
              <ChevronUpDownIcon
                aria-hidden="true"
                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </ListboxButton>

            <ListboxOptions
              transition
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
            >
              {getAssetViewOptions().map(
                (assetViewOption: AssetViewOption): React.ReactElement => (
                  <ListboxOption
                    key={assetViewOption.id}
                    value={assetViewOption}
                    className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                  >
                    <span className="block truncate font-normal group-data-selected:font-semibold">
                      {assetViewOption.name}
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
      </div>

      {/* Desktop Row Options */}
      <div className="hidden sm:block">
        <ul
          role="list"
          className="flex flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-500 sm:px-6 lg:px-8"
        >
          {getAssetViewOptions().map(
            (assetViewOption: AssetViewOption): React.ReactElement => (
              <li key={assetViewOption.name}>
                <a
                  onClick={(): void => setAssetViewOption({ ...assetViewOption, current: true })}
                  className={`cursor-pointer hover:text-gray-600 ${assetViewOption.current ? 'text-gray-900' : ''}`}
                >
                  {assetViewOption.name}
                </a>
              </li>
            )
          )}
        </ul>
      </div>
    </nav>
  );
};

export default InvestmentsAssetsViewOptions;
