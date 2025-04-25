'use client';

import { ResponsivePie } from '@nivo/pie';
import React from 'react';

import { US_DOLLAR } from '@/lib/constants/Constants';

interface PieChartProps {
  data: any;
  onClick: (slice) => void;
}

const PieChart: React.FC<PieChartProps> = ({ data, onClick }): React.ReactElement => {
  return (
    <ResponsivePie
      data={data}
      onClick={(slice): void => onClick(slice.label)}
      valueFormat={(value: number): string => `${US_DOLLAR.format(value)}`}
      colors={{ scheme: 'yellow_green_blue' }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={2}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={20}
      arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
    />
  );
};

export default PieChart;
