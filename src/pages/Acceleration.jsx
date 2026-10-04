import Section from '../components/Section';
import DataTable from '../components/DataTable';
import { useAsync } from '../hooks/useAsync';
import { listAcceleration } from '../services/leaderboardAPI';
import { hpTint } from '../utils/tints';

const COLUMNS = [
  { key: 'year', label: 'Year', secondary: true },
  { key: 'vehicle', label: 'Vehicle', wrap: true },
  { key: 'driver', label: 'Driver', align: 'center', secondary: true },
  { key: 'hp', label: 'HP', align: 'right', tint: (r) => hpTint(r.hp) },
  { key: 'weight_lb', label: 'Weight (lb)', align: 'right', secondary: true },
  { key: 'zero_to_30_seconds', label: '0–30 (s)', align: 'right' },
  { key: 'zero_to_60_seconds', label: '0–60 (s)', align: 'right' },
  { key: 'quarter_mile_seconds', label: '¼ mi (s)', align: 'right', secondary: true },
  { key: 'quarter_mile_mph', label: '¼ mi (mph)', align: 'right', secondary: true },
  { key: 'eighth_mile_seconds', label: '⅛ mi (s)', align: 'right', secondary: true },
  { key: 'eighth_mile_mph', label: '⅛ mi (mph)', align: 'right', secondary: true },
];

export default function Acceleration() {
  const { data, error, loading } = useAsync(listAcceleration);

  return (
    <div className="page">
      <h1 className="page-title">Acceleration Leaderboard</h1>
      <p className="page-lead">
        0–30 and 0–60 times from our cars, and any other self-propelled vehicles in the group.
      </p>
      <Section>
        <DataTable columns={COLUMNS} rows={data} loading={loading} error={error} />
      </Section>
    </div>
  );
}
