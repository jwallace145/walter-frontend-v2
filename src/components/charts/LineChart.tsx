'use client';

import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const LineChart = ({ data }): React.ReactElement => {
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
        format: '%Y-%m-%d',
        tickValues: 'every 5 days',
        tickSize: 5,
        tickPadding: 5,
        legend: 'Time',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        legend: 'Price',
        legendOffset: -50,
        legendPosition: 'middle',
        format: (value) => `$${Number(value).toFixed(2)}`,
      }}
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
            <div key={point.id}>
              <strong>{point.serieId}</strong>: ${Number(point.data.yFormatted).toFixed(2)}
            </div>
          ))}
        </div>
      )}
    />
  );
};

export default LineChart;
