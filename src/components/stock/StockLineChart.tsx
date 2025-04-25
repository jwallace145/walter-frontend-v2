import React from 'react';

import LoadingSpinner from '@/components/loading/LoadingSpinner';
import { Price } from '@/lib/models/Price';

import LineChart from '../charts/LineChart';

const data: any = [
  {
    id: 'japan',
    color: 'hsl(343, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 266,
      },
      {
        x: 'helicopter',
        y: 177,
      },
      {
        x: 'boat',
        y: 209,
      },
      {
        x: 'train',
        y: 296,
      },
      {
        x: 'subway',
        y: 127,
      },
      {
        x: 'bus',
        y: 139,
      },
      {
        x: 'car',
        y: 186,
      },
      {
        x: 'moto',
        y: 208,
      },
      {
        x: 'bicycle',
        y: 64,
      },
      {
        x: 'horse',
        y: 131,
      },
      {
        x: 'skateboard',
        y: 2,
      },
      {
        x: 'others',
        y: 146,
      },
    ],
  },
  {
    id: 'france',
    color: 'hsl(70, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 233,
      },
      {
        x: 'helicopter',
        y: 181,
      },
      {
        x: 'boat',
        y: 180,
      },
      {
        x: 'train',
        y: 70,
      },
      {
        x: 'subway',
        y: 14,
      },
      {
        x: 'bus',
        y: 124,
      },
      {
        x: 'car',
        y: 200,
      },
      {
        x: 'moto',
        y: 73,
      },
      {
        x: 'bicycle',
        y: 70,
      },
      {
        x: 'horse',
        y: 25,
      },
      {
        x: 'skateboard',
        y: 215,
      },
      {
        x: 'others',
        y: 176,
      },
    ],
  },
  {
    id: 'us',
    color: 'hsl(187, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 214,
      },
      {
        x: 'helicopter',
        y: 2,
      },
      {
        x: 'boat',
        y: 251,
      },
      {
        x: 'train',
        y: 247,
      },
      {
        x: 'subway',
        y: 83,
      },
      {
        x: 'bus',
        y: 13,
      },
      {
        x: 'car',
        y: 222,
      },
      {
        x: 'moto',
        y: 64,
      },
      {
        x: 'bicycle',
        y: 288,
      },
      {
        x: 'horse',
        y: 206,
      },
      {
        x: 'skateboard',
        y: 87,
      },
      {
        x: 'others',
        y: 147,
      },
    ],
  },
  {
    id: 'germany',
    color: 'hsl(139, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 215,
      },
      {
        x: 'helicopter',
        y: 104,
      },
      {
        x: 'boat',
        y: 188,
      },
      {
        x: 'train',
        y: 167,
      },
      {
        x: 'subway',
        y: 234,
      },
      {
        x: 'bus',
        y: 273,
      },
      {
        x: 'car',
        y: 176,
      },
      {
        x: 'moto',
        y: 16,
      },
      {
        x: 'bicycle',
        y: 211,
      },
      {
        x: 'horse',
        y: 248,
      },
      {
        x: 'skateboard',
        y: 238,
      },
      {
        x: 'others',
        y: 71,
      },
    ],
  },
  {
    id: 'norway',
    color: 'hsl(352, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 241,
      },
      {
        x: 'helicopter',
        y: 101,
      },
      {
        x: 'boat',
        y: 206,
      },
      {
        x: 'train',
        y: 165,
      },
      {
        x: 'subway',
        y: 207,
      },
      {
        x: 'bus',
        y: 258,
      },
      {
        x: 'car',
        y: 216,
      },
      {
        x: 'moto',
        y: 219,
      },
      {
        x: 'bicycle',
        y: 91,
      },
      {
        x: 'horse',
        y: 280,
      },
      {
        x: 'skateboard',
        y: 123,
      },
      {
        x: 'others',
        y: 207,
      },
    ],
  },
];

const StockLineChart: React.FC<{ prices: Price[]; loading: boolean }> = ({
  prices,
  loading,
}): React.ReactElement => {
  const getStockPrices = () => {
    if (loading) {
      return [];
    }

    const data = prices.map((price: Price) => ({
      x: price.timestamp,
      y: price.price,
    }));

    return [
      {
        id: 'TEST',
        color: 'hsl(343, 70%, 50%)',
        data: data,
      },
    ];
  };

  return (
    <div className="h-96 bg-white rounded-2xl p-6 shadow-md">
      {loading ? <LoadingSpinner /> : <LineChart data={getStockPrices()} />}
    </div>
  );
};

export default StockLineChart;
