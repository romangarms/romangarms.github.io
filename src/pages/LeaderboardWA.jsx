import Section from '../components/Section';
import DataTable from '../components/DataTable';
import PhotoCarousel from '../components/PhotoCarousel';
import TrackAddictCard from '../components/TrackAddictCard';
import { useAsync } from '../hooks/useAsync';
import { fetchSheet } from '../services/sheets';
import { SHEETS } from '../data/sheets';
import { PHOTOS, TRACK_ADDICT_WA } from '../data/media';
import { asset } from '../utils/asset';
import { conditionTint, limiterTint } from '../utils/tints';

const CANNONBALL_COLUMNS = [
  { key: 'Time', label: 'Time', align: 'right' },
  { key: 'Vehicle', label: 'Vehicle' },
  { key: 'Avg Speed', label: 'Avg (mph)', align: 'right' },
  { key: 'Top Speed', label: 'Top (mph)', align: 'right', tint: (r) => limiterTint(r['Top Speed']) },
  { key: 'Start Time', label: 'Start', align: 'right' },
  { key: 'Driver', label: 'Driver', align: 'center' },
  { key: 'Date', label: 'Date', align: 'right' },
  { key: 'Condition', label: 'Conditions', tint: (r) => conditionTint(r.Condition) },
];

const DISCO_COLUMNS = [
  { key: 'Time', label: 'Time', align: 'right' },
  { key: 'Model Year', label: 'Year' },
  { key: 'Vehicle', label: 'Vehicle' },
  { key: 'Direction Up/Down', label: 'Direction' },
  { key: 'Driver', label: 'Driver', align: 'center' },
  { key: 'Date', label: 'Date', align: 'right' },
];

function SheetTable({ sheet, columns }) {
  const { data, error, loading } = useAsync(() => fetchSheet(sheet), [sheet]);
  return <DataTable columns={columns} rows={data?.rows} loading={loading} error={error} />;
}

export default function LeaderboardWA() {
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
        <SheetTable sheet={SHEETS.cannonballNorth} columns={CANNONBALL_COLUMNS} />
        <h3 className="subsection-title">South Runs</h3>
        <SheetTable sheet={SHEETS.cannonballSouth} columns={CANNONBALL_COLUMNS} />
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
        <SheetTable sheet={SHEETS.disco} columns={DISCO_COLUMNS} />
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
