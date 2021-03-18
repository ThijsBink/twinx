import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const Chart = ({ data }) => (
  <ResponsiveContainer width='95%' height='95%'>
    <LineChart
      data={data}
      syncId='anyId'
      margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
    >
      <Line dataKey='value' dot={false} />
      <XAxis dataKey='time' angle='15' />
      <YAxis dataKey='value' domain={['auto', 'auto']} />
      <CartesianGrid strokeDasharray='7 7' />
      <Tooltip />
    </LineChart>
  </ResponsiveContainer>
);

export default Chart;
