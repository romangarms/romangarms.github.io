import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './StatsChart.css';

function StatsChart({ data, title }) {
  if (!data || data.length === 0) {
    return (
      <div className="stats-chart">
        {title && <h3 className="chart-title">{title}</h3>}
        <div className="chart-empty">No data available</div>
      </div>
    );
  }

  return (
    <div className="stats-chart">
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--bg-elevated)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="var(--text-secondary)"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              tickLine={{ stroke: 'var(--text-secondary)' }}
              axisLine={{ stroke: 'var(--bg-elevated)' }}
              angle={-45}
              textAnchor="end"
              height={60}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="var(--text-secondary)"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              tickLine={{ stroke: 'var(--text-secondary)' }}
              axisLine={{ stroke: 'var(--bg-elevated)' }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-elevated)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
              labelStyle={{ color: 'var(--text-secondary)' }}
              itemStyle={{ color: 'var(--accent-primary)' }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="var(--accent-primary)"
              strokeWidth={2}
              dot={{ fill: 'var(--accent-primary)', strokeWidth: 0, r: 4 }}
              activeDot={{ fill: 'var(--accent-primary)', strokeWidth: 0, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

StatsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      views: PropTypes.number.isRequired
    })
  ),
  title: PropTypes.string
};

export default StatsChart;
