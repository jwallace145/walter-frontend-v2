import React from 'react';
import dynamic from 'next/dynamic';

import { US_DOLLAR } from '@/lib/constants/Constants';

import { BarDatum } from '@nivo/bar';

const ResponsiveBar = dynamic(() => import('@nivo/bar').then((mod) => mod.ResponsiveBar), {
  ssr: false,
});

const BarChart: React.FC<{ data: BarDatum[] }> = ({ data }): React.ReactElement => {
  return (
    <ResponsiveBar
      data={data}
      keys={['value']}
      indexBy="id"
      margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      colors={{ scheme: 'pastel1' }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'middle',
        legendOffset: 32,
        format: (value) =>
          `${new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'middle',
        legendOffset: -40,
        format: (value) => US_DOLLAR.format(value),
        tickValues: 8,
      }}
      gridYValues={[]}
      enableGridX={false}
      enableGridY={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      valueFormat={(value) => US_DOLLAR.format(value)}
      label={(d) => US_DOLLAR.format(d.value as number)}
      animate={true}
    />
  );
};

export default BarChart;
