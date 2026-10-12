import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  Analytics01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Calendar03Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  Download01Icon,
  Exchange01Icon,
  File01Icon,
  GlobalIcon,
  Notification02Icon,
  Search01Icon,
  Settings01Icon,
  Store01Icon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons'

import { Legend, RevenueChart, VolumeChart } from './charts'
import {
  asOf,
  balanceTotal,
  balances,
  days,
  kpis,
  outcomes,
  partialDay,
  partialIndex,
  payoutRun,
  peakDay,
  period,
  topMerchants,
} from './data'

const Icon = ({ icon, size = 17 }) => (
  <HugeiconsIcon icon={icon} size={size} strokeWidth={1.6} />
)

const navItems = [
  { name: 'Dashboard', icon: DashboardSquare01Icon },
  { name: 'Finances', icon: Wallet01Icon },
  { name: 'Platforms', icon: GlobalIcon },
  { name: 'Configuration & fees', icon: Exchange01Icon },
  { name: 'Analytics', icon: Analytics01Icon },
  { name: 'Statements', icon: File01Icon },
  { name: 'Billing', icon: CreditCardIcon },
  { name: 'Merchants', icon: Store01Icon },
  { name: 'Settings', icon: Settings01Icon },
]

const tabs = ['Overview', 'Merchants', 'Transactions', 'Settlements']

function CardHead({ title, meta, action }) {
  return (
    <header className="card-head">
      <div>
        <h3>{title}</h3>
        {meta && <p className="meta">{meta}</p>}
      </div>
      {action && (
        <button className="link">
          {action}
          <Icon icon={ArrowRight01Icon} size={14} />
        </button>
      )}
    </header>
  )
}

export default function App() {
  return (
    <div className="shell">
      <aside className="rail">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          MonRize
        </div>

        <nav aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={item.name === 'Merchants' ? 'nav-item active' : 'nav-item'}
              aria-current={item.name === 'Merchants' ? 'page' : undefined}
            >
              <Icon icon={item.icon} size={16} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="rail-foot">
          <span className="chip-avatar" aria-hidden="true">
            AM
          </span>
          <div>
            <strong>Alex Morgan</strong>
            <small>Payments operations</small>
          </div>
        </div>
      </aside>

      <main className="main">
        {/* Header carries identity and the one primary action only. Export moved
            down to the historical section, which is what it exports. */}
        <header className="topbar">
          <div className="topbar-title">
            <h1>Merchants</h1>
            <span className="badge">42 active</span>
          </div>
          <div className="topbar-actions">
            <span className="search">
              <Icon icon={Search01Icon} size={16} />
              Search merchants
            </span>
            <button className="ghost-btn" aria-label="Notifications">
              <Icon icon={Notification02Icon} size={16} />
              <i className="dot-alert" aria-hidden="true" />
            </button>
            <button className="primary-btn">
              <Icon icon={Add01Icon} size={16} />
              Add merchant
            </button>
          </div>
        </header>

        <div className="tabbar">
          <div className="tabs" role="tablist" aria-label="Merchant views">
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={tab === 'Overview'}
                className={tab === 'Overview' ? 'tab active' : 'tab'}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="page">
          {/* ---- scope 1: a snapshot of now, no date filter ---------------- */}
          <div className="band-head">
            <h2>Current position</h2>
            <span className="tag live">
              <i aria-hidden="true" />
              {asOf}
            </span>
          </div>

          <section className="now" aria-label="Current position">
            <article className="card">
              <CardHead title="Upcoming payout" />
              <strong className="figure">{payoutRun.amount}</strong>
              <p className="figure-sub">
                {payoutRun.when} · {payoutRun.merchants}
              </p>
              <ul className="rails">
                {payoutRun.rails.map((rail) => (
                  <li key={rail.name}>
                    <span>{rail.name}</span>
                    <b>{rail.amount}</b>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card">
              {/* Conversions are demo figures, so the card says so where the
                  numbers are, not in a footnote below the fold. */}
              <CardHead
                title="Balances by currency"
                meta={`${balanceTotal} EUR equivalent at illustrative demo rates · incl. €52,340 rolling reserve`}
                action="Statements"
              />
              <ul className="balances">
                {balances.map((balance) => (
                  <li key={balance.code}>
                    <div className="bal-top">
                      <strong>{balance.code}</strong>
                      <em>{balance.share}%</em>
                    </div>
                    <span className="bal-eur">{balance.eur}</span>
                    <small className="bal-native">{balance.native}</small>
                    <div className="bal-track" aria-hidden="true">
                      <i style={{ width: `${balance.share}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          {/* ---- scope 2: everything the date filter applies to ------------ */}
          <div className="band-head hist">
            <h2>Historical performance</h2>
            <div className="filters">
              {partialDay && (
                <span className="tag progress">
                  <i aria-hidden="true" />
                  {partialDay} in progress
                </span>
              )}
              <button className="pill">
                <Icon icon={Calendar03Icon} size={14} />
                {period.label}
                <span className="sep">{period.range}</span>
                <Icon icon={ArrowDown01Icon} size={13} />
              </button>
              <div className="pill-group">
                <button className="pill">
                  {period.currency}
                  <Icon icon={ArrowDown01Icon} size={13} />
                </button>
                <button className="pill">
                  vs {period.compare}
                  <Icon icon={ArrowDown01Icon} size={13} />
                </button>
              </div>
              <button className="ghost-btn sm" aria-label="Export this period">
                <Icon icon={Download01Icon} size={15} />
              </button>
            </div>
          </div>

          <section className="kpis" aria-label="Key figures for the selected period">
            {kpis.map((kpi) => (
              <article className="kpi" key={kpi.label}>
                <p className="kpi-label">{kpi.label}</p>
                <strong className="kpi-value">{kpi.value}</strong>
                <p className="kpi-row">
                  <span className={`kpi-delta ${kpi.tone}`}>
                    <Icon
                      icon={kpi.direction === 'up' ? ArrowUpRight01Icon : ArrowDown01Icon}
                      size={13}
                    />
                    {kpi.delta}
                  </span>
                  <span className="kpi-note">{kpi.note}</span>
                </p>
              </article>
            ))}
          </section>

          <section className="charts">
            <article className="card">
              <CardHead title="Transaction volume" meta="€1,109,600 processed · +11.1%" />
              <Legend
                items={[
                  { label: period.range, kind: 'line-now' },
                  { label: period.compare, kind: 'line-prev' },
                  ...(partialDay ? [{ label: `${partialDay} partial`, kind: 'open' }] : []),
                ]}
              />
              <VolumeChart days={days} partial={partialIndex} />
            </article>

            <article className="card">
              <CardHead title="Net revenue" meta="€29,970 earned · peak Fri 25" />
              <Legend
                items={[
                  { label: 'Daily net', kind: 'bar-base' },
                  { label: 'Peak', kind: 'bar-peak' },
                  ...(partialDay ? [{ label: 'Partial', kind: 'bar-partial' }] : []),
                ]}
              />
              <RevenueChart days={days} peak={peakDay} partial={partialIndex} />
            </article>
          </section>

          <section className="lower">
            <article className="card">
              <CardHead title="Payment outcomes" meta={`${outcomes.attempts} attempts`} />
              <div className="outcome-bar" aria-hidden="true">
                <i className="ok" style={{ width: `${outcomes.succeeded.share}%` }} />
                <i className="bad" style={{ width: `${outcomes.failed.share}%` }} />
              </div>
              <ul className="outcome-legend">
                <li>
                  <span className="swatch bar-peak" aria-hidden="true" />
                  <div>
                    Succeeded
                    <b>
                      {outcomes.succeeded.count}
                      <em>{outcomes.succeeded.share}%</em>
                    </b>
                  </div>
                </li>
                <li>
                  <span className="swatch fail" aria-hidden="true" />
                  <div>
                    Failed
                    <b>
                      {outcomes.failed.count}
                      <em>{outcomes.failed.share}%</em>
                    </b>
                  </div>
                </li>
              </ul>
              <p className="foot">{outcomes.chargebacks} chargebacks · 0.38% of succeeded</p>
            </article>

            <article className="card">
              <CardHead
                title="Top merchants by payout"
                meta="Top 5 of 42 · €700,600 of €1,052,480 period payouts"
                action="View all"
              />
              <ol className="merchants">
                {topMerchants.map((merchant, i) => (
                  <li key={merchant.name}>
                    <span className="rank">{i + 1}</span>
                    <span className="chip-avatar" aria-hidden="true">
                      {merchant.initials}
                    </span>
                    <div className="merchant-name">
                      <strong>{merchant.name}</strong>
                      <small>{merchant.category}</small>
                    </div>
                    <div className="merchant-value">
                      <strong>{merchant.payout}</strong>
                      <small>{merchant.share}% of payouts</small>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          </section>
        </div>
      </main>
    </div>
  )
}
