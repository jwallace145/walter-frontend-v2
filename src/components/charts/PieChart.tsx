'use client';

import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { US_DOLLAR } from '@/pages/api/Constants';

const PieChart = ({ data }): React.ReactElement => {
  return (
    <ResponsivePie
      data={data}
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
      colors={{ scheme: 'yellow_green_blue' }}
      valueFormat={(value) => `${US_DOLLAR.format(value)}`}
    />
  );
};

export default PieChart;
