import Section from '../components/Section';
import DataTable from '../components/DataTable';
import { useAsync } from '../hooks/useAsync';
import { fetchSheet } from '../services/sheets';
import { SHEETS } from '../data/sheets';

const COLUMNS = [
  { key: 'Year', label: 'Year' },
  { key: 'Vehicle', label: 'Vehicle' },
  { key: 'Driver', label: 'Driver', align: 'center' },
  { key: 'Horsepower', label: 'HP', align: 'right' },
  { key: 'Weight', label: 'Weight (lb)', align: 'right' },
  { key: '0-30 Time', label: '0–30 (s)', align: 'right' },
  { key: '0-60 Time', label: '0–60 (s)', align: 'right' },
  { key: '1/4 Time', label: '¼ mi (s)', align: 'right' },
  { key: '1/4 Speed', label: '¼ mi (mph)', align: 'right' },
  { key: '1/8 Time', label: '⅛ mi (s)', align: 'right' },
  { key: '1/8 Speed', label: '⅛ mi (mph)', align: 'right' },
];

export default function Acceleration() {
  const { data, error, loading } = useAsync(() => fetchSheet(SHEETS.acceleration));

  return (
    <div className="page">
      <h1 className="page-title">Acceleration Leaderboard</h1>
      <p className="page-lead">
        0–30 and 0–60 times from our cars, and any other self-propelled vehicles in the group.
      </p>
      <Section>
        <DataTable columns={COLUMNS} rows={data?.rows} loading={loading} error={error} />
      </Section>
    </div>
  );
}
