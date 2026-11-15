import {useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {DashboardSquare01Icon, Wallet01Icon, Store01Icon, Settings01Icon, Search01Icon, Notification02Icon, ArrowDown01Icon, Analytics01Icon, File01Icon, CreditCardIcon, Exchange01Icon, PlusSignIcon, ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon} from '@hugeicons/core-free-icons';

const I = ({icon, size = 18}) => <HugeiconsIcon icon={icon} size={size} strokeWidth={1.6}/>;

const nav = [['Dashboard', DashboardSquare01Icon], ['Finances', Wallet01Icon], ['Platforms', Exchange01Icon], ['Configuration & fees', Settings01Icon], ['Analytics', Analytics01Icon], ['Statements', File01Icon], ['Billing', CreditCardIcon], ['Merchants', Store01Icon]];

const merchants = [['MP', 'Masum Parvej', 'hello@masum.design', '€18,420.00'], ['FM', 'Floyd Miles', 'floyd@example.com', '€14,860.00'], ['DR', 'Dianne Russell', 'dianne@example.com', '€12,760.00'], ['RR', 'Ronald Richards', 'ronald@example.com', '€10,940.00']];

const balances = [['USD', '$10,180.00'], ['RUB', '₽33,180.00'], ['UAH', '₴98,110.00'], ['EUR', '€59,609.00'], ['GBP', '£15,043.00']];

const days = ['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26', 'Sun 27'];

/* Illustrative figures. Volume sums to €77,206.40, revenue to €12,220.64,
   matching the KPI row. Sunday is the partial day in progress. */
const volume = [7420, 9860, 12640, 11180, 15860, 13900, 6346.4];
const volumePrev = [6100, 8400, 10600, 9200, 12300, 11400, 7200];
const revenue = [1180, 1540, 2060, 1820, 3180, 1900, 540.64];
const peak = 4;

/* The SVG is authored at the exact px width of the column it renders in, so
   there is no viewBox scaling and no letterboxing inside the panel. A chart
   left alone in the row is authored at the full surface width instead; the
   fixed gutters below keep the geometry identical at the default 551px. */
const H = 212, GRID_X = 40, TOP = 10, BASE = 170, STEP = 40, X0 = 62, RIGHT_PAD = 39;
const plot = BASE - TOP;
const step = w => (w - X0 - RIGHT_PAD) / 6;
const y = (v, max) => BASE - (v / max) * plot;

function Frame({w, max, ticks, children, label}) {
  const x = i => X0 + i * step(w);
  return (
    <svg className="chart" width={w} height={H} viewBox={`0 0 ${w} ${H}`} style={{aspectRatio: `${w} / ${H}`}} role="img" aria-label={label}>
      {ticks.map((t, i) => (
        <g key={t}>
          <line x1={GRID_X} y1={TOP + i * STEP} x2={w - 16} y2={TOP + i * STEP} stroke="#2e2e2e" strokeDasharray="3 5"/>
          <text x={GRID_X - 10} y={TOP + i * STEP + 4} textAnchor="end" fontSize="11" fill="#8a8a8a">{t}</text>
        </g>
      ))}
      {children}
      {days.map((d, i) => <text key={d} x={x(i)} y={195} textAnchor="middle" fontSize="11" fill="#8a8a8a">{d}</text>)}
    </svg>
  );
}

function VolumeChart({w}) {
  const px = i => X0 + i * step(w);
  const py = v => y(v, 20000);
  const points = vals => vals.map((v,i) => `${px(i)},${py(v)}`).join(' ');
  return (
    <svg className="chart volume-chart" width={w} height={H} viewBox={`0 0 ${w} ${H}`} style={{aspectRatio: `${w} / ${H}`}} role="img" aria-label="Daily transaction volume, this week and previous week. Sunday is partial.">
      {[20000,10000,0].map(v => <g key={v}>
        <line x1={GRID_X} x2={w - 16} y1={py(v)} y2={py(v)} stroke="#303030" strokeWidth="0.7"/>
        <text x={GRID_X - 10} textAnchor="end" y={py(v)+4} fill="#858585" fontSize="10">{v === 0 ? '0' : `€${v/1000}k`}</text>
      </g>)}
      <polyline points={points(volumePrev)} fill="none" stroke="#565b58" strokeWidth="1.2" strokeDasharray="3 5" strokeLinecap="round"/>
      <polyline points={points(volume)} fill="none" stroke="#65c99b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {days.map((d,i) => <text key={d} x={px(i)} y={195} textAnchor="middle" fill="#858585" fontSize="10">{d}</text>)}
    </svg>
  );
}

function RevenueChart({w}) {
  const bar = Math.round(step(w) * 0.5333);
  return (
    <Frame w={w} max={4000} ticks={['€4k', '€3k', '€2k', '€1k', '0']} label="Daily revenue for the last seven days">
      {revenue.map((v, i) => (
        <rect key={i} x={X0 + i * step(w) - bar / 2} y={y(v, 4000)} width={bar} height={BASE - y(v, 4000)} rx="3" fill={i === peak ? '#3ecf8e' : '#345347'}/>
      ))}

    </Frame>
  );
}

/* The five dashboard widgets. `row` keeps a widget in the band it was designed
   for, so reordering never drops a 364px chart into the 282px detail band.
   `span` is the widget's column proportion inside the detail band. */
const WIDGETS = {
  volume: {name: 'Transaction volume', row: 'charts'},
  revenue: {name: 'Revenue', row: 'charts'},
  payouts: {name: 'Planned payouts', row: 'detail', span: 1},
  top: {name: 'Top merchants by payouts', row: 'detail', span: 1.15},
  balances: {name: 'Currency balances', row: 'detail', span: 1},
};
const DEFAULT_ORDER = ['volume', 'revenue', 'payouts', 'top', 'balances'];

/* Authored width of the plot. The paired columns keep the original 551, so the
   default dashboard renders exactly as before; a chart alone in the row is
   authored at the full 1152px surface instead of being scaled up to it. */
const chartWidth = count => count === 1 ? 1152 : 551;

function WidgetTools({id, first, last, onMove, onRemove}) {
  const {name} = WIDGETS[id];
  return (
    <div className="widget-tools">
      <button type="button" aria-label={`Move ${name} earlier`} disabled={first} onClick={() => onMove(id, -1)}><I icon={ArrowLeft01Icon} size={14}/></button>
      <button type="button" aria-label={`Move ${name} later`} disabled={last} onClick={() => onMove(id, 1)}><I icon={ArrowRight01Icon} size={14}/></button>
      <button type="button" aria-label={`Remove ${name}`} onClick={() => onRemove(id)}><I icon={Cancel01Icon} size={14}/></button>
    </div>
  );
}

function Widget({id, tools, chartW}) {
  if (id === 'volume') return (
    <article className="panel">
      <div className="panel-head"><h2>Transaction volume</h2>{tools}</div>
      <strong className="chart-total">€77,206.40</strong>
      <VolumeChart w={chartW}/>
      <div className="chart-foot"><span className="legend"><span><i/>This week</span><span><i className="previous"/>Previous week</span></span></div>
    </article>
  );
  if (id === 'revenue') return (
    <article className="panel">
      <div className="panel-head"><h2>Revenue</h2>{tools}</div>
      <strong className="chart-total">€12,220.64</strong>
      <RevenueChart w={chartW}/>
      <div className="chart-foot"><span>Peak day · Fri 25</span><strong>€3,180.00</strong></div>
    </article>
  );
  if (id === 'payouts') return (
    <article className="panel">
      <div className="panel-head"><h2>Planned payouts</h2><span>Next 7 days</span>{tools}</div>
      <strong className="total">€5,698.00</strong>
      <p className="muted">Across 12 scheduled payouts</p>
      <div className="outcomes">
        <div className="panel-head"><h2>Payment outcomes</h2></div>
        <div className="progress"><i/></div>
        <div className="outcome-values">
          <div><span><i/>Successful</span><strong>1,946 <small>95.4%</small></strong></div>
          <div><span><i className="failed"/>Failed</span><strong>94 <small>4.6%</small></strong></div>
        </div>
      </div>
    </article>
  );
  if (id === 'top') return (
    <article className="panel">
      <div className="panel-head"><h2>Top merchants by payouts</h2>{tools}</div>
      {merchants.map(([initial, n, email, v], index) => (
        <div className="merchant" key={n} style={{"--rank-width": `${[100,80.7,69.3,59.4][index]}%`}}><span className="logo">{initial}</span><div>{n}<small>{email}</small></div><strong>{v}</strong></div>
      ))}
    </article>
  );
  return (
    <article className="panel">
      <div className="panel-head"><h2>Currency balances</h2><span>Current</span>{tools}</div>
      <div className="balance-label"><span>Currency</span><span>Amount</span></div>
      {balances.map(([n, v]) => <div className="balance" key={n}><span>{n}</span><strong>{v}</strong></div>)}
    </article>
  );
}

export default function App() {
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [removed, setRemoved] = useState([]);
  const [editing, setEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const shown = row => order.filter(id => WIDGETS[id].row === row && !removed.includes(id));
  const chartIds = shown('charts');
  const detailIds = shown('detail');
  const removedIds = order.filter(id => removed.includes(id));
  const chartW = chartWidth(chartIds.length);

  /* Moving swaps a widget with its nearest visible neighbour in the same band,
     so the two bands keep their own running order. */
  const move = (id, dir) => setOrder(prev => {
    const peers = prev.filter(w => WIDGETS[w].row === WIDGETS[id].row && !removed.includes(w));
    const target = peers[peers.indexOf(id) + dir];
    if (!target) return prev;
    const next = [...prev];
    next[prev.indexOf(id)] = target;
    next[prev.indexOf(target)] = id;
    return next;
  });

  const remove = id => {
    setRemoved(prev => [...prev, id]);
    setAddOpen(false);
  };

  const restore = id => {
    setRemoved(prev => prev.filter(w => w !== id));
    if (removedIds.length === 1) setAddOpen(false);
  };

  const toggleEditing = () => {
    setEditing(prev => !prev);
    setAddOpen(false);
  };

  const toolsFor = (id, list) => editing
    ? <WidgetTools id={id} first={list[0] === id} last={list[list.length - 1] === id} onMove={move} onRemove={remove}/>
    : null;

  const columns = ids => ids.map(id => `${WIDGETS[id].span ?? 1}fr`).join(' ');

  return (
    <div className={editing ? 'app-shell editing' : 'app-shell'}>
      <aside>
        <div className="brand">Mon<span>Rize</span><i/></div>
        <div className="workspace"><span className="logo">M</span><div>MonRize workspace<small>Business account</small></div><I icon={ArrowDown01Icon} size={14}/></div>
        <p className="nav-label">WORKSPACE</p>
        <nav>{nav.map(([n, icon]) => <button key={n} className={n === 'Merchants' ? 'selected' : ''}><I icon={icon}/>{n}</button>)}</nav>
        <button className="settings"><I icon={Settings01Icon}/>Settings</button>
        <div className="profile"><span className="logo">AM</span><div>Alex Morgan<small>Workspace admin</small></div></div>
      </aside>
      <main>
        <header>
          <h1 className="header-title">Merchants</h1>
          <div className="header-actions"><span><I icon={Search01Icon}/>Search <kbd>⌘ K</kbd></span><I icon={Notification02Icon}/><span className="avatar">AM</span></div>
        </header>
        <div className="page">
          <div className="tabs" role="tablist" aria-label="Merchant views">
            {['Overview', 'All merchants', 'Transactions', 'Finances'].map(n => <button key={n} role="tab" aria-selected={n === 'Overview'} className={n === 'Overview' ? 'active' : ''}>{n}</button>)}
          </div>
          <div className="report-controls">
            <button className="date">Sep 21 – 27, 2026 <I icon={ArrowDown01Icon} size={14}/></button>
            <span className="comparison">vs previous period</span>

          </div>
          <section className="metrics">
            {[['Processed volume', '€77,206.40', '+18.4%', 'up'], ['Revenue', '€12,220.64', '+22.2%', 'up'], ['Fees earned', '€1,300.00', '−12.2%', 'down'], ['Chargeback rate', '0.42%', '−0.08 pp', 'up']].map(([n, v, c, k]) => (
              <article key={n}><p>{n}</p><strong>{v}</strong><small className={k}>{c}</small></article>
            ))}
          </section>

          <div className={removed.length ? 'data-surface customized' : 'data-surface'}>
            {chartIds.length > 0 && (
              <section className="charts" style={{gridTemplateColumns: columns(chartIds)}}>
                {chartIds.map(id => <Widget key={id} id={id} chartW={chartW} tools={toolsFor(id, chartIds)}/>)}
              </section>
            )}

            {detailIds.length > 0 && (
              <section className="detail-row" style={{gridTemplateColumns: columns(detailIds)}}>
                {detailIds.map(id => <Widget key={id} id={id} tools={toolsFor(id, detailIds)}/>)}
              </section>
            )}

            {chartIds.length === 0 && detailIds.length === 0 && (
              <p className="surface-empty">All widgets are hidden. Use Add widget to bring one back.</p>
            )}
          </div>

          <footer>Illustrative data <span>MonRize · Merchant overview</span></footer>
        </div>
      </main>
    </div>
  );
}
