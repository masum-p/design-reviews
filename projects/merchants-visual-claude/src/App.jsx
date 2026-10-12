import {HugeiconsIcon} from '@hugeicons/react';
import {DashboardSquare01Icon, Wallet01Icon, Store01Icon, Settings01Icon, Search01Icon, Notification02Icon, ArrowDown01Icon, Analytics01Icon, File01Icon, CreditCardIcon, Exchange01Icon} from '@hugeicons/core-free-icons';

const I = ({icon, size = 18}) => <HugeiconsIcon icon={icon} size={size} strokeWidth={1.6}/>;

const nav = [['Dashboard', DashboardSquare01Icon], ['Finances', Wallet01Icon], ['Platforms', Exchange01Icon], ['Configuration & fees', Settings01Icon], ['Analytics', Analytics01Icon], ['Statements', File01Icon], ['Billing', CreditCardIcon], ['Merchants', Store01Icon]];

const merchants = [['MP', 'Masum Parvej', 'hello@masum.design', '€18,420.00', 18420], ['FM', 'Floyd Miles', 'floyd@example.com', '€14,860.00', 14860], ['DR', 'Dianne Russell', 'dianne@example.com', '€12,760.00', 12760], ['RR', 'Ronald Richards', 'ronald@example.com', '€10,940.00', 10940]];
const merchantMax = Math.max(...merchants.map(m => m[4]));

const balances = [['USD', '$10,180.00'], ['RUB', '₽33,180.00'], ['UAH', '₴98,110.00'], ['EUR', '€59,609.00'], ['GBP', '£15,043.00']];

const days = ['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26', 'Sun 27'];

/* Illustrative figures. Volume sums to €77,206.40, revenue to €12,220.64,
   matching the KPI row. Sunday is the partial day in progress. */
const volume = [7420, 9860, 12640, 11180, 15860, 13900, 6346.4];
const volumePrev = [6100, 8400, 10600, 9200, 12300, 11400, 7200];
const revenue = [1180, 1540, 2060, 1820, 3180, 1900, 540.64];
const peak = 4;

/* The SVG is authored at the exact px size it renders at, so there is no
   viewBox scaling and no letterboxing inside the panel. */
const W = 526, H = 191, GRID_X = 44, TOP = 8, BASE = 160, STEP = 38, X0 = 64, DX = 73;
const plot = BASE - TOP;
const x = i => X0 + i * DX;
const y = (v, max) => BASE - (v / max) * plot;

/* A compact inset strip carrying the panel's own totals, so each chart reads
   on its own without borrowing the KPI row above it. */
function Summary({cells}) {
  return (
    <div className="chart-summary">
      {cells.map(([label, value], i) => (
        <div key={label} className={i === 0 ? 'lead' : ''}><span>{label}</span><strong>{value}</strong></div>
      ))}
    </div>
  );
}

function Frame({ticks, children, label}) {
  return (
    <svg className="chart" width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {ticks.map((t, i) => (
        <g key={t}>
          <line x1={GRID_X} y1={TOP + i * STEP} x2={W} y2={TOP + i * STEP} stroke="#2b2b2b" strokeDasharray="2 6"/>
          <text x={GRID_X - 10} y={TOP + i * STEP + 4} textAnchor="end" fontSize="10" fill="#7d7d7d">{t}</text>
        </g>
      ))}
      <line x1={GRID_X} y1={BASE} x2={W} y2={BASE} stroke="#3a3a3a"/>
      {children}
      {days.map((d, i) => <text key={d} x={x(i)} y={H - 7} textAnchor="middle" fontSize="10" fill="#7d7d7d">{d}</text>)}
    </svg>
  );
}

function VolumeChart() {
  const pts = vals => vals.map((v, i) => `${x(i)},${y(v, 20000).toFixed(1)}`).join(' ');
  const area = `${X0},${BASE} ${pts(volume)} ${x(volume.length - 1)},${BASE}`;
  return (
    <Frame ticks={['€20k', '€15k', '€10k', '€5k', '0']} label="Transaction volume this week compared with the previous week">
      <defs>
        <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ecf8e" stopOpacity=".22"/>
          <stop offset="100%" stopColor="#3ecf8e" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#volumeFill)"/>
      <polyline points={pts(volumePrev)} fill="none" stroke="#5c5c5c" strokeWidth="1.5" strokeDasharray="4 5"/>
      <polyline points={pts(volume)} fill="none" stroke="#3ecf8e" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round"/>
      {volume.map((v, i) => <circle key={i} cx={x(i)} cy={y(v, 20000)} r={i === peak ? 3.5 : 2.5} fill="#202020" stroke="#3ecf8e" strokeWidth={i === peak ? 2.5 : 1.75}/>)}
    </Frame>
  );
}

function RevenueChart() {
  const bw = 38;
  return (
    <Frame ticks={['€4k', '€3k', '€2k', '€1k', '0']} label="Daily revenue for the last seven days">
      {revenue.map((v, i) => (
        <g key={i}>
          <rect x={x(i) - bw / 2} y={TOP} width={bw} height={plot} rx="4" fill="#252525"/>
          <rect x={x(i) - bw / 2} y={y(v, 4000)} width={bw} height={BASE - y(v, 4000)} rx="4" fill={i === peak ? '#3ecf8e' : '#3a3a3a'}/>
        </g>
      ))}
    </Frame>
  );
}

export default function App() {
  return (
    <div className="app-shell">
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
            {['Overview', 'Merchant list', 'Transactions', 'Merchant finances'].map(n => <button key={n} role="tab" aria-selected={n === 'Overview'} className={n === 'Overview' ? 'active' : ''}>{n}</button>)}
          </div>
          <div className="report-controls">
            <button className="date">Sep 21 – 27, 2026 <I icon={ArrowDown01Icon} size={14}/></button>
            <span>vs previous 7 days · EUR</span>
            <small className="partial"><i/>Sun 27 partial</small>
          </div>
          <section className="metrics">
            {[['Processed volume', '€77,206.40', '+18.4%', 'up'], ['Revenue', '€12,220.64', '+22.2%', 'up'], ['Fees earned', '€1,300.00', '−12.2%', 'down'], ['Chargeback rate', '0.42%', '−0.08 pp', 'up']].map(([n, v, c, k]) => (
              <article key={n}><p>{n}</p><strong>{v}</strong><small className={k}>{c}</small></article>
            ))}
          </section>

          <div className="data-surface">
            <section className="charts">
              <article className="panel">
                <div className="panel-head"><h2>Transaction volume</h2><span className="chart-period">Last 7 days</span></div>
                <Summary cells={[['Total volume', '€77,206.40'], ['Daily average', '€11,029.49'], ['Peak · Fri 25', '€15,860.00']]}/>
                <VolumeChart/>
                <div className="chart-foot"><span className="legend"><span><i/>This week</span><span><i className="previous"/>Previous week</span></span></div>
              </article>
              <article className="panel">
                <div className="panel-head"><h2>Revenue</h2><span className="chart-period">Last 7 days</span></div>
                <Summary cells={[['Total revenue', '€12,220.64'], ['Daily average', '€1,745.81'], ['Peak · Fri 25', '€3,180.00']]}/>
                <RevenueChart/>
                <div className="chart-foot"><span className="legend"><span><i className="muted-dot"/>Daily revenue</span><span><i/>Peak day</span></span></div>
              </article>
            </section>

            <section className="detail-row">
              <article className="panel">
                <div className="panel-head"><h2>Planned payouts</h2><span>Next 7 days</span></div>
                <strong className="total">€5,698.00</strong>
                <p className="muted">Across 12 scheduled payouts</p>
                <div className="outcomes">
                  <div className="outcomes-head"><h3>Payment outcomes</h3><span>This week</span></div>
                  <div className="progress"><i/></div>
                  <div className="outcome-values">
                    <div><span><i/>Successful</span><strong>1,946<small>95.4%</small></strong></div>
                    <div><span><i className="failed"/>Failed</span><strong>94<small>4.6%</small></strong></div>
                  </div>
                </div>
              </article>

              <article className="panel">
                <div className="panel-head"><h2>Top merchants by payouts</h2><span>Sep 21 – 27</span></div>
                <div className="row-label"><span>Merchant</span><span>Payouts</span></div>
                <div className="rank-rows">
                  {merchants.map(([initial, n, email, v, amount]) => (
                    <div className="merchant" key={n}>
                      <i className="rank-bar" style={{width: `${(amount / merchantMax) * 100}%`}}/>
                      <span className="logo">{initial}</span>
                      <div>{n}<small>{email}</small></div>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel">
                <div className="panel-head"><h2>Currency balances</h2><span>Current</span></div>
                <div className="row-label"><span>Currency</span><span>Amount</span></div>
                <div className="balance-rows">
                  {balances.map(([n, v]) => <div className="balance" key={n}><span className="code">{n}</span><strong>{v}</strong></div>)}
                </div>
              </article>
            </section>
          </div>

          <footer>Illustrative data <span>MonRize · Merchant overview</span></footer>
        </div>
      </main>
    </div>
  );
}
