import Section from '../components/Section';
import DataTable from '../components/DataTable';
import TrackAddictCard from '../components/TrackAddictCard';
import { useAsync } from '../hooks/useAsync';
import { listCourses, getCourseLeaderboard } from '../services/leaderboardAPI';
import { fetchSheet } from '../services/sheets';
import { SHEETS } from '../data/sheets';
import { TRACK_ADDICT_CA } from '../data/media';
import { formatDate } from '../utils/format';
import { asset } from '../utils/asset';
import { hpTint, conditionTint } from '../utils/tints';

const BASE_COLUMNS = [
  { key: 'hp', label: 'HP', align: 'right', tint: (r) => hpTint(r.hp) },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'avg_speed_mph', label: 'Avg (mph)', align: 'right' },
  { key: 'top_speed_mph', label: 'Top (mph)', align: 'right' },
  { key: 'driver', label: 'Driver', align: 'center' },
  { key: 'run_date', label: 'Date', align: 'right', render: (r) => formatDate(r.run_date) || '—' },
  { key: 'time_of_day', label: 'Time of Day', align: 'right' },
  { key: 'conditions', label: 'Road', tint: (r) => conditionTint(r.conditions) },
];

function columnsFor(runs) {
  const hasLegacy = runs.some((r) => r.legacy);
  const hasNotes = runs.some((r) => r.notes);
  return [
    { key: 'adjusted_time', label: hasLegacy ? 'Adj. Time' : 'Time', align: 'right' },
    ...(hasLegacy
      ? [{ key: 'time', label: 'Raw Time', align: 'right', tint: (r) => (r.legacy ? 'lightgreen' : null) }]
      : []),
    ...BASE_COLUMNS,
    ...(hasLegacy ? [{ key: 'legacy', label: 'Legacy', align: 'center' }] : []),
    ...(hasNotes ? [{ key: 'notes', label: 'Notes' }] : []),
  ];
}

// The published sheet is the fallback when the API can't be reached; its columns are
// mapped onto the API's run shape so both render through the same table.
const SHEET_FALLBACKS = [
  {
    course: { name: 'Skidpad to 4 Corners Uphill', distance_miles: 1.65, legacy_distance_miles: 1.7 },
    sheet: SHEETS.hwy9Skidpad,
    map: (r) => ({
      adjusted_time: r['Adj.Time'], time: r['Raw Time'], hp: r.HP, vehicle: r.Vehicle,
      avg_speed_mph: r['Avg Speed'], top_speed_mph: r['Top Speed'], driver: r.Driver,
      run_date: r.Date, time_of_day: r['Time of Day'], conditions: r.Road,
      legacy: r.Legacy === 'TRUE',
    }),
  },
  {
    course: { name: 'Intro to HWY 9' },
    sheet: SHEETS.hwy9Intro,
    map: (r) => ({
      adjusted_time: r.Time, time: r.Time, hp: r.HP, vehicle: r.Vehicle,
      avg_speed_mph: r['Avg Speed'], top_speed_mph: r['Top Speed'], driver: r.Driver,
      run_date: r.Date, time_of_day: r['Time of Day'], conditions: r.Conditions,
      legacy: false, notes: r.Info,
    }),
  },
];

async function loadBoards() {
  try {
    const courses = await listCourses();
    const boards = await Promise.all(courses.map((c) => getCourseLeaderboard(c.id)));
    return { source: 'api', boards };
  } catch (apiError) {
    const boards = await Promise.all(
      SHEET_FALLBACKS.map(async ({ course, sheet, map }) => ({
        course,
        runs: (await fetchSheet(sheet)).rows.filter((r) => r.Vehicle).map(map),
      })),
    );
    return { source: 'sheet', apiError, boards };
  }
}

function courseNote(course) {
  if (!course.distance_miles) return null;
  const legacy = course.legacy_distance_miles
    ? ` Legacy runs were set on the old ${course.legacy_distance_miles} mi course and are scaled to match.`
    : '';
  return `${course.distance_miles} mi course.${legacy}`;
}

export default function LeaderboardCA() {
  const { data, error, loading } = useAsync(loadBoards);
  const boards = data?.boards ?? SHEET_FALLBACKS.map(({ course }) => ({ course, runs: [] }));

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Highway 9 Run Leaderboard</h1>
          <p className="page-lead">Timed runs on Highway 9 in the Santa Cruz Mountains.</p>
        </div>
        <img src={asset('images/hwy9.png')} alt="Cannonball 9 highway shield" className="page-art" />
      </header>

      {data?.source === 'sheet' && (
        <div className="notice">
          The live leaderboard API couldn't be reached, so these tables come from the published sheet.
        </div>
      )}

      {boards.map(({ course, runs }) => (
        <Section key={course.name} title={course.name} subtitle={courseNote(course)}>
          <DataTable columns={columnsFor(runs)} rows={runs} loading={loading} error={error} />
        </Section>
      ))}

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
