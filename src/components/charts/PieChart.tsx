'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import { US_DOLLAR } from '@/lib/constants/Constants';

const ResponsivePie = dynamic(() => import('@nivo/pie').then((mod) => mod.ResponsivePie), {
  ssr: false,
});

export interface PieSlice {
  id: string;
  label: string;
  value: number;
}

interface PieChartProps {
  data: PieSlice[];
  onClick: (slice: string) => void;
}

const PieChart: React.FC<PieChartProps> = ({ data, onClick }): React.ReactElement => {
  return (
    <ResponsivePie
      data={data}
      valueFormat={(value: number): string => `${US_DOLLAR.format(value)}`}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={30}
      arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
    />
  );
};

export default PieChart;
