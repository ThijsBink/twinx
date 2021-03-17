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

export default function Chart({ data }) {
  console.log('CHART DATA', data);
  return (
    <ResponsiveContainer width='95%' height='95%'>
      <LineChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <Line dataKey='value' dot={false} />
        <XAxis dataKey='time' angle='15' />
        <YAxis dataKey='value' />
        <CartesianGrid strokeDasharray='7 7' />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}
