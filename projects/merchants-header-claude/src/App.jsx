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
const W = 526, H = 220, GRID_X = 40, TOP = 10, BASE = 182, STEP = 43, X0 = 56, DX = 74;
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
  const px = i => 46 + i * 76;
  const py = v => 182 - (v / 20000) * 168;
  const points = vals => vals.map((v,i) => `${px(i)},${py(v)}`).join(' ');
  return (
    <svg className="chart volume-chart" width="526" height="220" viewBox="0 0 526 220" role="img" aria-label="Daily transaction volume, this week and previous week. Sunday is partial.">
      {[20000,10000,0].map(v => <g key={v}>
        <line x1="46" x2="502" y1={py(v)} y2={py(v)} stroke="#303030" strokeWidth="0.7"/>
        <text x="0" y={py(v)+4} fill="#858585" fontSize="10">{v === 0 ? '0' : `€${v/1000}k`}</text>
      </g>)}
      <polygon points={`46,182 ${points(volume)} 502,182`} fill="#3ecf8e" fillOpacity="0.035"/>
      <polyline points={points(volumePrev)} fill="none" stroke="#565b58" strokeWidth="1.2" strokeDasharray="3 5" strokeLinecap="round"/>
      <polyline points={points(volume)} fill="none" stroke="#65c99b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {days.map((d,i) => <text key={d} x={px(i)} y="213" textAnchor="middle" fill="#858585" fontSize="10">{d}</text>)}
    </svg>
  );
}

function RevenueChart() {
  return (
    <Frame max={4000} ticks={['€4k', '€3k', '€2k', '€1k', '0']} label="Daily revenue for the last seven days">
      {revenue.map((v, i) => (
        <rect key={i} x={x(i) - 20} y={y(v, 4000)} width="40" height={BASE - y(v, 4000)} rx="3" fill={i === peak ? '#3ecf8e' : '#345347'}/>
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
        {/* One 56px row carries identity, section navigation and utilities. */}
        <header>
          <h1 className="header-title">Merchants</h1>
          <span className="header-divider" aria-hidden="true"/>
          <div className="tabs" role="tablist" aria-label="Merchant views">
            {['Overview', 'All merchants', 'Transactions', 'Finances'].map(n => <button key={n} role="tab" aria-selected={n === 'Overview'} className={n === 'Overview' ? 'active' : ''}>{n}</button>)}
          </div>
          <div className="header-actions">
            <span className="search"><I icon={Search01Icon} size={16}/>Search <kbd>⌘ K</kbd></span>
            <span className="bell" role="img" aria-label="Notifications"><I icon={Notification02Icon}/></span>
            <span className="avatar">AM</span>
          </div>
        </header>
        <div className="page">
          {/* Reporting context sits in its own row: range, comparison, currency. */}
          <div className="report-controls">
            <button className="date">Sep 21 – 27, 2026 <I icon={ArrowDown01Icon} size={14}/></button>
            <span className="control-divider" aria-hidden="true"/>
            <span className="report-field"><span className="label">Compared with</span><span className="value">Previous 7 days</span></span>
            <span className="control-divider" aria-hidden="true"/>
            <span className="report-field"><span className="label">Reporting currency</span><span className="value">EUR</span></span>
            <small className="partial"><i/>Sun 27 in progress · totals and changes include a partial day</small>
          </div>
          <section className="metrics">
            {[['Processed volume', '€77,206.40', '+18.4%', 'up'], ['Revenue', '€12,220.64', '+22.2%', 'up'], ['Fees earned', '€1,300.00', '−12.2%', 'down'], ['Chargeback rate', '0.42%', '−0.08 pp', 'up']].map(([n, v, c, k]) => (
              <article key={n}><p>{n}</p><strong>{v}</strong><small className={k}>{c}</small></article>
            ))}
          </section>

          <div className="data-surface">
            <section className="charts">
              <article className="panel">
                <div className="panel-head"><h2>Transaction volume</h2></div>
                <strong className="chart-total">€77,206.40</strong>
                <VolumeChart/>
                <div className="chart-foot"><span className="legend"><span><i/>This period</span><span><i className="previous"/>Previous period</span></span></div>
              </article>
              <article className="panel">
                <div className="panel-head"><h2>Revenue</h2></div>
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
                  <div className="panel-head"><h2>Payment outcomes</h2></div>
                  <div className="progress"><i/></div>
                  <div className="outcome-values">
                    <div><span><i/>Successful</span><strong>1,946 <small>95.4%</small></strong></div>
                    <div><span><i className="failed"/>Failed</span><strong>94 <small>4.6%</small></strong></div>
                  </div>
                </div>
              </article>

              <article className="panel">
                <div className="panel-head"><h2>Top merchants by payouts</h2></div>
                {merchants.map(([initial, n, email, v], index) => (
                  <div className="merchant" key={n} style={{"--rank-width": `${[100,80.7,69.3,59.4][index]}%`}}><span className="logo">{initial}</span><div>{n}<small>{email}</small></div><strong>{v}</strong></div>
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
