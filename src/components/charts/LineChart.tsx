'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import { US_DOLLAR } from '@/lib/constants/Constants';

import { Serie } from '@nivo/line';

const ResponsiveLine = dynamic(() => import('@nivo/line').then((mod) => mod.ResponsiveLine), {
  ssr: false,
});

const LineChart: React.FC<{ data: Serie[] }> = ({ data }): React.ReactElement => {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 30, right: 40, bottom: 50, left: 60 }}
      xScale={{
        type: 'time',
        format: '%Y-%m-%dT%H:%M:%S',
        precision: 'minute',
      }}
      xFormat="time:%H:%M"
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
        reverse: false,
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: '%b, %d',
        tickValues: 'every 5 days',
        tickSize: 5,
        tickPadding: 5,
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        legendOffset: -50,
        legendPosition: 'middle',
        format: (value) => `${US_DOLLAR.format(value as number)}`,
        tickValues: 6,
      }}
      enableGridX={false}
      enableGridY={false}
      curve="monotoneX"
      pointSize={3}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={1}
      pointBorderColor={{ from: 'serieColor' }}
      colors={{ scheme: 'tableau10' }}
      enablePoints={true}
      useMesh={true}
      enableSlices="x"
      sliceTooltip={({ slice }) => (
        <div
          style={{
            background: 'white',
            padding: '8px 12px',
            border: '1px solid #ccc',
          }}
        >
          {slice.points.map((point) => (
            <div
              key={point.id}
              style={{
                color: (point.data.y as number) < 0 ? 'red' : 'black',
              }}
            >
              <strong>{point.serieId}</strong>: {US_DOLLAR.format(point.data.y as number)}
            </div>
          ))}
        </div>
      )}
    />
  );
};

export default LineChart;
