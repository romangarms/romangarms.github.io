import Section from '../components/Section';
import DataTable from '../components/DataTable';
import PhotoCarousel from '../components/PhotoCarousel';
import TrackAddictCard from '../components/TrackAddictCard';
import { useAsync } from '../hooks/useAsync';
import { loadBoards } from '../services/leaderboardAPI';
import { PHOTOS, TRACK_ADDICT_WA } from '../data/media';
import { asset } from '../utils/asset';
import { formatDate } from '../utils/format';
import { conditionTint, limiterTint } from '../utils/tints';

const isLimited = (r) => limiterTint(r.notes);

const CANNONBALL_COLUMNS = [
  { key: 'time', label: 'Time', align: 'right' },
  { key: 'vehicle', label: 'Vehicle', wrap: true },
  { key: 'avg_speed_mph', label: 'Avg (mph)', align: 'right', secondary: true },
  {
    key: 'top_speed_mph',
    label: 'Top (mph)',
    align: 'right',
    secondary: true,
    tint: isLimited,
    render: (r) => (r.top_speed_mph == null ? '—' : `${r.top_speed_mph}${isLimited(r) ? ' (limiter)' : ''}`),
  },
  { key: 'time_of_day', label: 'Start', align: 'right', secondary: true },
  { key: 'driver', label: 'Driver', align: 'center' },
  { key: 'run_date', label: 'Date', align: 'right', secondary: true, render: (r) => formatDate(r.run_date) || '—' },
  { key: 'conditions', label: 'Conditions', tint: (r) => conditionTint(r.conditions) },
];

const DISCO_COLUMNS = [
  { key: 'time', label: 'Time', align: 'right' },
  { key: 'vehicle', label: 'Vehicle', wrap: true },
  { key: 'notes', label: 'Direction' },
  { key: 'driver', label: 'Driver', align: 'center' },
  { key: 'run_date', label: 'Date', align: 'right', secondary: true, render: (r) => formatDate(r.run_date) || '—' },
];

export default function LeaderboardWA() {
  const { data: boards, error, loading } = useAsync(() => loadBoards('WA'));
  const table = (name, columns) => (
    <DataTable
      columns={columns}
      rows={boards?.find((b) => b.course.name === name)?.runs}
      loading={loading}
      error={error}
    />
  );

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Leaderboard (WA)</h1>
          <p className="page-lead">Run times from the Washington side of the group.</p>
        </div>
        <img src={asset('images/logo.png')} alt="Cannonball: Seattle to Bellingham Memorial Dash" className="page-art" />
      </header>

      <Section id="cannonball" title="Bellingham Cannonball Run Leaderboard">
        <img src={asset('images/cannonball-smoke.jpg')} alt="" className="hero-image" />
        <h3 className="subsection-title">North Runs</h3>
        {table('Cannonball North', CANNONBALL_COLUMNS)}
        <h3 className="subsection-title">South Runs</h3>
        {table('Cannonball South', CANNONBALL_COLUMNS)}
      </Section>

      <Section
        id="photos"
        title="Photos From The Runs"
        subtitle="From prepping for the event, to top speeds during the run, to pretty photos afterward."
      >
        <PhotoCarousel photos={PHOTOS} />
      </Section>

      <Section
        id="disco"
        title="Disco Run Leaderboard"
        subtitle="Recorded times using Track Addict of the Discovery Park touge."
      >
        {table('Disco Run', DISCO_COLUMNS)}
      </Section>

      <Section id="record" title="Record Your Own Time (WA)" subtitle="Import into Track Addict.">
        <div className="card-grid">
          {TRACK_ADDICT_WA.map((t) => (
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
