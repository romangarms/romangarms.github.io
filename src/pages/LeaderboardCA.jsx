import Section from '../components/Section';
import DataTable from '../components/DataTable';
import TrackAddictCard from '../components/TrackAddictCard';
import { useAsync } from '../hooks/useAsync';
import { listCourses, getCourseLeaderboard } from '../services/leaderboardAPI';
import { TRACK_ADDICT_CA } from '../data/media';
import { formatDate } from '../utils/format';
import { asset } from '../utils/asset';
import { hpTint, conditionTint } from '../utils/tints';

const BASE_COLUMNS = [
  { key: 'hp', label: 'HP', align: 'right', tint: (r) => hpTint(r.hp) },
  { key: 'vehicle', label: 'Vehicle', wrap: true },
  { key: 'avg_speed_mph', label: 'Avg (mph)', align: 'right', secondary: true },
  { key: 'top_speed_mph', label: 'Top (mph)', align: 'right', secondary: true },
  { key: 'driver', label: 'Driver', align: 'center' },
  { key: 'run_date', label: 'Date', align: 'right', secondary: true, render: (r) => formatDate(r.run_date) || '—' },
  { key: 'time_of_day', label: 'Time of Day', align: 'right', secondary: true },
  { key: 'conditions', label: 'Conditions', tint: (r) => conditionTint(r.conditions) },
];

function columnsFor(runs) {
  const hasLegacy = runs.some((r) => r.legacy);
  const hasNotes = runs.some((r) => r.notes);
  return [
    { key: 'adjusted_time', label: hasLegacy ? 'Adj. Time' : 'Time', align: 'right' },
    ...(hasLegacy
      ? [{ key: 'time', label: 'Raw Time', align: 'right', secondary: true, tint: (r) => (r.legacy ? 'lightgreen' : null) }]
      : []),
    ...BASE_COLUMNS,
    ...(hasLegacy ? [{ key: 'legacy', label: 'Legacy', align: 'center', secondary: true }] : []),
    ...(hasNotes ? [{ key: 'notes', label: 'Info' }] : []),
  ];
}

async function loadBoards() {
  const courses = await listCourses();
  return Promise.all(courses.map((c) => getCourseLeaderboard(c.id)));
}

function courseNote(course) {
  if (!course.distance_miles) return null;
  const legacy = course.legacy_distance_miles
    ? ` Legacy runs were set on the old ${course.legacy_distance_miles} mi course and are scaled to match.`
    : '';
  return `${course.distance_miles} mi course.${legacy}`;
}

export default function LeaderboardCA() {
  const { data: boards, error, loading } = useAsync(loadBoards);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Highway 9 Run Leaderboard</h1>
          <p className="page-lead">Timed runs on Highway 9 in the Santa Cruz Mountains.</p>
        </div>
        <img src={asset('images/hwy9.png')} alt="Cannonball 9 highway shield" className="page-art" />
      </header>

      {boards ? (
        boards.map(({ course, runs }) => (
          <Section key={course.id} title={course.name} subtitle={courseNote(course)}>
            <DataTable columns={columnsFor(runs)} rows={runs} />
          </Section>
        ))
      ) : (
        <Section title="Courses">
          <DataTable columns={columnsFor([])} rows={[]} loading={loading} error={error} />
        </Section>
      )}

      <Section id="record" title="Record Your Own Time (CA - HWY 9)" subtitle="Import into Track Addict.">
        <div className="card-grid">
          {TRACK_ADDICT_CA.map((t) => (
            <TrackAddictCard key={t.name} {...t} />
          ))}
        </div>
      </Section>

      <Section id="audi" title="Dedicated to the Audi. :(">
        <p className="muted">(using unreal engine 5) (zoom zoom)</p>
      </Section>
    </div>
  );
}
