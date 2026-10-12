import {HugeiconsIcon} from '@hugeicons/react';
import {DashboardSquare01Icon, Wallet01Icon, Store01Icon, Settings01Icon, Search01Icon, Notification02Icon, ArrowDown01Icon, Analytics01Icon, File01Icon, CreditCardIcon, Exchange01Icon} from '@hugeicons/core-free-icons';

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

/* The SVG is authored at the exact px size it renders at, so there is no
   viewBox scaling and no letterboxing inside the panel. */
const W = 530, H = 220, GRID_X = 44, TOP = 6, BASE = 182, STEP = 44, X0 = 68, DX = 73;
const plot = BASE - TOP;
const x = i => X0 + i * DX;
const y = (v, max) => BASE - (v / max) * plot;

function Frame({max, ticks, children, label}) {
  return (
    <svg className="chart" width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {ticks.map((t, i) => (
        <g key={t}>
          <line x1={GRID_X} y1={TOP + i * STEP} x2={W} y2={TOP + i * STEP} stroke="#2e2e2e" strokeDasharray="3 5"/>
          <text x={GRID_X - 10} y={TOP + i * STEP + 4} textAnchor="end" fontSize="11" fill="#8a8a8a">{t}</text>
        </g>
      ))}
      {children}
      {days.map((d, i) => <text key={d} x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="#8a8a8a">{d}</text>)}
    </svg>
  );
}

function VolumeChart() {
  const path = vals => vals.map((v, i) => `${x(i)},${y(v, 20000).toFixed(1)}`).join(' ');
  return (
    <Frame max={20000} ticks={['€20k', '€15k', '€10k', '€5k', '0']} label="Transaction volume this week compared with the previous week">
      <polyline points={path(volumePrev)} fill="none" stroke="#6b6b6b" strokeWidth="1.5" strokeDasharray="5 5"/>
      <polyline points={path(volume)} fill="none" stroke="#3ecf8e" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {volume.map((v, i) => <circle key={i} cx={x(i)} cy={y(v, 20000)} r="3" fill="#202020" stroke="#3ecf8e" strokeWidth="2"/>)}
    </Frame>
  );
}

function RevenueChart() {
  return (
    <Frame max={4000} ticks={['€4k', '€3k', '€2k', '€1k', '0']} label="Daily revenue for the last seven days">
      {revenue.map((v, i) => (
        <rect key={i} x={x(i) - 20} y={y(v, 4000)} width="40" height={BASE - y(v, 4000)} rx="3" fill={i === peak ? '#3ecf8e' : '#323232'}/>
      ))}
      <g aria-hidden="true">
        <rect x={x(peak) - 58} y="14" width="116" height="50" rx="6" fill="#282828" stroke="#3d3d3d"/>
        <text x={x(peak)} y="34" textAnchor="middle" fontSize="10" fill="#999">Fri 25, 2026</text>
        <text x={x(peak)} y="55" textAnchor="middle" fontSize="14" fontWeight="500" fill="#eee">€3,180.00</text>
      </g>
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
                <strong className="chart-total">€77,206.40</strong>
                <VolumeChart/>
                <div className="chart-foot"><span className="legend"><span><i/>This week</span><span><i className="previous"/>Previous week</span></span></div>
              </article>
              <article className="panel">
                <div className="panel-head"><h2>Revenue</h2><span className="chart-period">Last 7 days</span></div>
                <strong className="chart-total">€12,220.64</strong>
                <RevenueChart/>
                <div className="chart-foot"><span>Peak day · Fri 25</span><strong>€3,180.00</strong></div>
              </article>
            </section>

            <section className="detail-row">
              <article className="panel">
                <div className="panel-head"><h2>Planned payouts</h2><span>Next 7 days</span></div>
                <strong className="total">€5,698.00</strong>
                <p className="muted">Across 12 scheduled payouts</p>
                <div className="outcomes">
                  <div className="panel-head"><h2>Payment outcomes</h2><span>This week</span></div>
                  <div className="progress"><i/></div>
                  <div className="outcome-values">
                    <div><span><i/>Successful</span><strong>1,946 <small>95.4%</small></strong></div>
                    <div><span><i className="failed"/>Failed</span><strong>94 <small>4.6%</small></strong></div>
                  </div>
                </div>
              </article>

              <article className="panel">
                <div className="panel-head"><h2>Top merchants by payouts</h2><span>Sep 21 – 27</span></div>
                {merchants.map(([initial, n, email, v]) => (
                  <div className="merchant" key={n}><span className="logo">{initial}</span><div>{n}<small>{email}</small></div><strong>{v}</strong></div>
                ))}
              </article>

              <article className="panel">
                <div className="panel-head"><h2>Currency balances</h2><span>Current</span></div>
                <div className="balance-label"><span>Currency</span><span>Amount</span></div>
                {balances.map(([n, v]) => <div className="balance" key={n}><span>{n}</span><strong>{v}</strong></div>)}
              </article>
            </section>
          </div>

          <footer>Illustrative data <span>MonRize · Merchant overview</span></footer>
        </div>
      </main>
    </div>
  );
}
