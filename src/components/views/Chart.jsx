import PropTypes from 'prop-types';
import { Typography, Card } from '@material-ui/core';
import {
  ResponsiveContainer,
  LineChart,
  ReferenceLine,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

/**
 * Recharts documentation: https://recharts.org/en-US/
 */

const ChartTooltip = ({ color, active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card
        style={{
          backgroundColor: '#f2f2f2',
          padding: '3px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant='caption'>{label}</Typography>
        <Typography variant='h6' style={{ color }}>
          <strong>{payload[0].value}</strong>
        </Typography>
      </Card>
    );
  }

  return null;
};

const Chart = ({ syncId, type, signal, color, data }) => (
  <ResponsiveContainer width='95%' height='95%'>
    {type === 'line' ? (
      <LineChart
        syncId={syncId}
        data={data}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
      >
        <Line
          connectNulls
          dataKey='value'
          dot={false}
          stroke={color}
          strokeWidth={1.5}
        />
        <XAxis dataKey='time' angle={15} stroke='#0000009f' />
        <YAxis dataKey='value' domain={['auto', 'auto']} stroke='#0000009f' />
        <CartesianGrid strokeDasharray='7 7' stroke='#00000020' />
        {signal.type !== 'none' && (
          <ReferenceLine
            y={signal.threshold}
            stroke='red'
            strokeWidth={2}
            strokeDasharray='3 3'
            label={signal.type === 'greater' ? 'MAX' : 'MIN'}
          />
        )}
        <Tooltip
          content={<ChartTooltip color={color} />}
          cursor={{ fill: '#0000001f' }}
        />
      </LineChart>
    ) : (
      <BarChart
        syncId={syncId}
        data={data}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
      >
        <Bar dataKey='value' fill={color} />
        <XAxis dataKey='time' angle={15} stroke='#0000009f' />
        <YAxis dataKey='value' domain={['auto', 'auto']} stroke='#0000009f' />
        <CartesianGrid strokeDasharray='7 7' stroke='#00000020' />
        {signal.type !== 'none' && (
          <ReferenceLine
            y={signal.threshold}
            stroke='red'
            strokeWidth={2}
            strokeDasharray='3 3'
            label={signal.type === 'greater' ? 'MAX' : 'MIN'}
          />
        )}
        <Tooltip
          content={<ChartTooltip color={color} />}
          cursor={{ fill: '#0000001f' }}
        />
      </BarChart>
    )}
  </ResponsiveContainer>
);

export default Chart;

Chart.propTypes = {
  syncId: PropTypes.string,
  type: PropTypes.string,
  signal: PropTypes.object,
  color: PropTypes.string,
  data: PropTypes.array,
};
