import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  Analytics01Icon,
  ArrowDataTransferHorizontalIcon,
  ArrowDown01Icon,
  ArrowDownRight01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  Download04Icon,
  HelpCircleIcon,
  Invoice01Icon,
  Notification03Icon,
  Search01Icon,
  Settings01Icon,
  SidebarLeftIcon,
  Store01Icon,
  UnfoldMoreIcon,
  UserGroupIcon,
  Wallet01Icon,
} from '@hugeicons-pro/core-stroke-standard'

/* ---------- Mock data (as shown in the Paymie frame) ---------- */

const NAV_WORKSPACE = [
  { label: 'Overview', icon: DashboardSquare01Icon },
  { label: 'Analytics', icon: Analytics01Icon, active: true },
  { label: 'Transactions', icon: ArrowDataTransferHorizontalIcon },
  { label: 'Balances', icon: Wallet01Icon },
  { label: 'Merchants', icon: Store01Icon },
  { label: 'Cards', icon: CreditCardIcon },
  { label: 'Statements', icon: Invoice01Icon },
]

const NAV_MANAGEMENT = [
  { label: 'Team & access', icon: UserGroupIcon },
  { label: 'Settings', icon: Settings01Icon },
]

const KPIS = [
  { label: 'Transaction volume', value: '€148,698.40', delta: '12.0%' },
  { label: 'Net earnings', value: '€54,481.58', delta: '8.2%' },
  { label: 'Fees earned', value: '€5,328.56', delta: '12.0%' },
  { label: 'Payout success rate', value: '98.6%', delta: '1.2 pp' },
]

// Code/name/symbol pairs kept exactly as in the source frame (see open questions).
const CURRENCIES = [
  { symbol: '$', code: 'USD', name: 'US dollar', share: 34, amount: '€18,524.48' },
  { symbol: '€', code: 'BTC', name: 'Euro', share: 24, amount: '€13,075.20' },
  { symbol: '¥', code: 'LINK', name: 'Japanese yen', share: 18, amount: '€9,806.40' },
  { symbol: '£', code: 'ADE', name: 'British pound', share: 12, amount: '€6,537.60' },
  { symbol: '₽', code: 'DOT', name: 'Ukrainian hryvnia', share: 8, amount: '€4,358.70' },
  { symbol: '₴', code: 'BNB', name: 'Binance coin', share: 4, amount: '€2,179.20' },
]

const COUNTRIES = [
  { code: 'US', name: 'United States', amount: '€71,375', share: 48, color: 'var(--color-data-1)' },
  { code: 'IN', name: 'India', amount: '€32,714', share: 22, color: 'var(--color-data-2)' },
  { code: 'JP', name: 'Japan', amount: '€26,766', share: 18, color: 'var(--color-data-3)' },
  { code: 'GB', name: 'United Kingdom', amount: '€17,844', share: 12, color: 'var(--color-data-4)' },
]

const MERCHANTS = [
  {
    initials: 'AC',
    name: 'ABC Corporation',
    email: 'hello@abccorp.com',
    country: 'Brazil',
    category: 'Agency',
    last: 'Today, 4:24 PM',
    volume: '€32,480.00',
    share: '21.8%',
  },
]

/* ---------- Primitives ---------- */

function Icon({ icon, size = 14, className = '' }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.5} className={className} aria-hidden="true" />
}

function Truncate({ children, className = '' }) {
  return (
    <span className={`block min-w-0 truncate ${className}`} title={typeof children === 'string' ? children : undefined}>
      {children}
    </span>
  )
}

const ghostIconBtn =
  'inline-flex size-7 shrink-0 items-center justify-center rounded-md text-fg-3 transition-colors hover:bg-veil-3 hover:text-fg-1 active:bg-veil-2'

const secondaryBtn =
  'inline-flex h-7 shrink-0 items-center gap-1.5 rounded-[7px] border border-transparent bg-veil-2 px-2.5 text-body text-fg-2 shadow-secondary transition-colors hover:bg-veil-3 hover:text-fg-1 active:bg-veil-2'

// One label style for every section and column label: uppercase, tracked, regular weight, muted.
const labelCaps = 'text-micro font-normal tracking-[0.06em] uppercase text-fg-3'
const colHead = `h-8 ${labelCaps}`

/*
 * Paymie's signature crop marks, used on section blocks only: 1px L-ticks sitting 6px outside
 * each corner (half the 12px block gap), so ticks of neighbouring blocks meet as a "+".
 * Offsets resolve from the block's padding box, so they include its 1px border.
 */
const CORNERS = [
  { top: true, left: true },
  { top: true, left: false },
  { top: false, left: true },
  { top: false, left: false },
]

function CropMarks() {
  // Right/bottom ticks sit 1px further out so a neighbour's stroke lands on the same pixel.
  const near = -7
  const far = -8
  return CORNERS.map(({ top, left }) => (
    <span
      key={`${top}${left}`}
      aria-hidden="true"
      className="pointer-events-none absolute size-[7px] border-crop"
      style={{
        [top ? 'top' : 'bottom']: top ? near : far,
        [left ? 'left' : 'right']: left ? near : far,
        [top ? 'borderTopWidth' : 'borderBottomWidth']: 1,
        [left ? 'borderLeftWidth' : 'borderRightWidth']: 1,
      }}
    />
  ))
}

function Pill({ children }) {
  return (
    <span className="inline-flex h-5 shrink-0 items-center rounded-[6px] border border-transparent bg-veil-2 px-2 text-small text-fg-3 shadow-secondary tabular-nums">
      {children}
    </span>
  )
}

// Section block: sits on the page surface, defined by a hairline border and crop marks (no fill, no shadow).
function Card({ children, className = '' }) {
  return (
    <section className={`relative rounded-xl border border-section ${className}`}>
      {children}
      <CropMarks />
    </section>
  )
}

function CardHeader({ title, subtitle, aside, id }) {
  return (
    <header className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
      <div className="min-w-0">
        <h2 id={id} className="truncate text-body font-medium text-fg-1">
          {title}
        </h2>
        <Truncate className="text-body text-fg-3">{subtitle}</Truncate>
      </div>
      {aside}
    </header>
  )
}

function Meter({ value, color = 'var(--color-primary)', className = '' }) {
  return (
    <span className={`block h-1 overflow-hidden rounded-full bg-muted ${className}`} aria-hidden="true">
      <span className="block h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </span>
  )
}

/* ---------- Sidebar ---------- */

function NavItem({ label, icon, active }) {
  return (
    <li>
      <a
        href="#"
        aria-current={active ? 'page' : undefined}
        className={`flex h-7 items-center gap-2.5 rounded-md px-2 text-body transition-colors ${
          active ? 'bg-[#ffffff06] text-btn-fg' : 'text-label hover:bg-veil-2 hover:text-fg-1'
        }`}
      >
        <Icon icon={icon} className={active ? 'text-btn-fg' : 'text-fg-3'} />
        <Truncate>{label}</Truncate>
      </a>
    </li>
  )
}

function NavSection({ label, items }) {
  return (
    <nav aria-label={label} className="mt-5">
      <h3 className={`mb-1 px-2 ${labelCaps}`}>{label}</h3>
      <ul className="flex flex-col gap-px">
        {items.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </ul>
    </nav>
  )
}

function Sidebar() {
  return (
    <aside className="flex w-[240px] shrink-0 flex-col px-3 pb-3">
      <div className="flex h-12 items-center justify-between pl-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-5 shrink-0 place-items-center rounded-[5px] bg-fg-1 text-micro font-semibold text-app">
            P
          </span>
          <Truncate className="text-body font-semibold text-fg-1">Paymie, Inc</Truncate>
        </div>
        <button type="button" aria-label="Collapse sidebar" className={ghostIconBtn}>
          <Icon icon={SidebarLeftIcon} size={16} />
        </button>
      </div>

      <button
        type="button"
        className="flex h-11 w-full items-center gap-2.5 rounded-lg border border-line bg-veil-1 px-2 text-left transition-colors hover:bg-veil-2"
      >
        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-muted text-micro font-semibold text-fg-1">
          PW
        </span>
        <span className="min-w-0 flex-1">
          <Truncate className="text-body font-medium text-fg-1">Paymie Workspace</Truncate>
          <Truncate className="text-small text-fg-3">Business account</Truncate>
        </span>
        <Icon icon={UnfoldMoreIcon} className="text-fg-3" />
      </button>

      <NavSection label="Workspace" items={NAV_WORKSPACE} />
      <NavSection label="Management" items={NAV_MANAGEMENT} />

      <div className="mt-auto flex flex-col gap-2">
        <button
          type="button"
          className="flex h-11 w-full items-center gap-2.5 rounded-lg px-2 text-left transition-colors hover:bg-veil-2"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-micro font-medium text-fg-2">
            AM
          </span>
          <span className="min-w-0 flex-1">
            <Truncate className="text-body font-medium text-fg-1">Alex Morgan</Truncate>
            <Truncate className="text-small text-fg-3">Workspace admin</Truncate>
          </span>
          <Icon icon={ArrowDown01Icon} className="text-fg-3" />
        </button>
      </div>
    </aside>
  )
}

/* ---------- Top row (on the page background, above the sheet) ---------- */

// Breadcrumb sits outside the main sheet like a folder tab: flush with the sheet's left
// edge, with search and account controls flush with its right edge.
function TopRow() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-4">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-body">
          <li>
            <a href="#" className="rounded text-fg-3 transition-colors hover:text-fg-1">
              Workspace
            </a>
          </li>
          <li aria-hidden="true" className="text-fg-4">
            /
          </li>
          <li>
            <span aria-current="page" className="px-1 font-medium text-fg-1">
              Analytics
            </span>
          </li>
        </ol>
      </nav>

      <div className="flex items-center gap-2">
        <label className="flex h-8 w-60 items-center gap-2 rounded-[7px] border border-line bg-veil-1 pr-1 pl-2 text-fg-3 transition-colors focus-within:border-line-card hover:border-line-strong">
          <Icon icon={Search01Icon} />
          <input
            type="search"
            placeholder="Search…"
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent text-body text-fg-1 outline-none placeholder:text-fg-3"
          />
          <kbd className="rounded border border-line-strong px-1 font-sans text-micro text-fg-3">⌘K</kbd>
        </label>
        <button
          type="button"
          aria-label="Help and support"
          title="Help and support"
          className={ghostIconBtn.replace('size-7', 'size-8')}
        >
          <Icon icon={HelpCircleIcon} size={16} />
        </button>
        <button type="button" aria-label="Notifications" className={ghostIconBtn.replace('size-7', 'size-8')}>
          <Icon icon={Notification03Icon} size={16} />
        </button>
        {/* Primary action lives top-right, Stripe-style, next to the account controls. */}
        <button
          type="button"
          aria-label="Create transfer"
          title="Create transfer"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-btn text-btn-fg shadow-btn transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          <Icon icon={Add01Icon} size={16} />
        </button>
        <button
          type="button"
          aria-label="Account: Alex Morgan"
          className="grid size-8 place-items-center rounded-full transition-opacity hover:opacity-80"
        >
          <span className="grid size-8 place-items-center rounded-full bg-muted text-micro font-medium text-fg-2">AM</span>
        </button>
      </div>
    </header>
  )
}

/* ---------- Page sections ---------- */

function Delta({ children, down = false }) {
  return (
    <span className="inline-flex items-center gap-1 text-small font-medium text-green tabular-nums">
      <Icon icon={down ? ArrowDownRight01Icon : ArrowUpRight01Icon} size={12} />
      {children}
    </span>
  )
}

function KpiCard() {
  return (
    <>
    <Card>
      <dl className="grid grid-cols-4">
        {KPIS.map((kpi, i) => (
          <div key={kpi.label} className={`min-w-0 px-5 pt-4 pb-4 ${i > 0 ? 'border-l border-line' : ''}`}>
            <dt>
              <Truncate className="text-body text-fg-3">{kpi.label}</Truncate>
            </dt>
            <dd className="mt-2 text-kpi font-medium text-fg-1 tabular-nums">{kpi.value}</dd>
            <dd className="mt-1">
              <Delta>{kpi.delta}</Delta>
            </dd>
          </div>
        ))}
      </dl>
    </Card>
      {/* Rolling-balance strip: its own unbordered row below the KPI block, as in the original */}
      <div className="flex h-11 items-center justify-between gap-6 px-5">
        <dl className="flex min-w-0 items-center gap-6 text-body">
          <div className="flex items-center gap-2">
            <Icon icon={Wallet01Icon} className="text-fg-3" />
            <dt className="text-fg-3">Rolling balance</dt>
            <dd className="font-medium text-fg-1 tabular-nums">€924,398.90</dd>
          </div>
          <span aria-hidden="true" className="h-4 w-px bg-line-strong" />
          <div className="flex items-center gap-2">
            <dt className="text-fg-3">Chargeback rate</dt>
            <dd className="font-medium text-fg-1 tabular-nums">0.42%</dd>
            <dd>
              <Delta down>0.08 percentage points</Delta>
            </dd>
          </div>
        </dl>
        <p className="flex shrink-0 items-center gap-1.5 text-body text-fg-3 tabular-nums">
          <Icon icon={CheckmarkCircle02Icon} className="text-green" />
          Down from 0.50% last period
        </p>
      </div>
    </>
  )
}

function CurrencyCard() {
  return (
    <Card className="flex flex-col">
      <CardHeader
        id="currency-title"
        title="Where your earnings come from"
        subtitle="Net earnings by settlement currency"
        aside={<Pill>6 currencies</Pill>}
      />
      <table aria-labelledby="currency-title" className="w-full table-fixed text-body">
        <colgroup>
          <col />
          <col className="w-[128px]" />
          <col className="w-[144px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-line text-fg-3">
            <th scope="col" className={`${colHead} pl-5 text-left`}>
              Currency
            </th>
            <th scope="col" className={`${colHead} text-left`}>
              Share
            </th>
            <th scope="col" className={`${colHead} pr-5 text-right`}>
              Net earning
            </th>
          </tr>
        </thead>
        <tbody>
          {CURRENCIES.map((c) => (
            <tr key={c.code} className="border-b border-line transition-colors last:border-b-0 hover:bg-veil-1">
              <td className="h-[52px] pl-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-veil-2 text-body text-fg-2"
                  >
                    {c.symbol}
                  </span>
                  <span className="min-w-0">
                    <Truncate className="font-medium text-fg-1">{c.code}</Truncate>
                    <Truncate className="text-small text-fg-3">{c.name}</Truncate>
                  </span>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2.5">
                  <Meter value={c.share} className="w-16" />
                  <span className="w-8 text-right text-fg-2 tabular-nums">{c.share}%</span>
                </div>
              </td>
              <td className="pr-5 text-right font-medium text-fg-1 tabular-nums">{c.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-auto border-t border-line px-5 py-3 text-small text-fg-3">Amounts converted to EUR at settlement</p>
    </Card>
  )
}

function CountryCard() {
  return (
    <Card className="flex flex-col">
      <CardHeader
        id="country-title"
        title="Transactions by country"
        subtitle="Share of total transaction volume"
        aside={<Pill>4 markets</Pill>}
      />
      <div className="px-5 pt-1">
        <p className="flex items-baseline gap-2">
          <span className="text-h3 font-medium text-fg-1 tabular-nums">€148,698.40</span>
          <span className="text-body text-fg-3">Total volume</span>
        </p>
        <div
          role="img"
          aria-label="Share of volume: United States 48%, India 22%, Japan 18%, United Kingdom 12%"
          className="mt-3 flex h-2 gap-0.5"
        >
          {COUNTRIES.map((c) => (
            <span
              key={c.code}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ width: `${c.share}%`, background: c.color }}
            />
          ))}
        </div>
      </div>
      <table aria-labelledby="country-title" className="mt-4 w-full table-fixed text-body">
        <colgroup>
          <col />
          <col className="w-[104px]" />
          <col className="w-[72px]" />
        </colgroup>
        <thead className="sr-only">
          <tr>
            <th scope="col">Country</th>
            <th scope="col">Volume</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {COUNTRIES.map((c) => (
            <tr key={c.code} className="border-t border-line transition-colors hover:bg-veil-1">
              <td className="h-[60px] pl-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-veil-2 text-micro font-medium text-fg-2"
                  >
                    {c.code}
                  </span>
                  <span className="flex min-w-0 flex-1 items-center gap-2.5">
                    <Truncate className="w-32 text-fg-1">{c.name}</Truncate>
                    <Meter value={c.share} color={c.color} className="w-24" />
                  </span>
                </div>
              </td>
              <td className="text-right font-medium text-fg-1 tabular-nums">{c.amount}</td>
              <td className="pr-5 text-right text-fg-2 tabular-nums">{c.share}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-auto flex items-center gap-2 border-t border-line px-5 py-3 text-small text-fg-3">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-data-1" />
        The United States accounts for nearly half of your volume.
      </p>
    </Card>
  )
}

function MerchantsCard() {
  const th = colHead
  return (
    <Card>
      <CardHeader
        id="merchants-title"
        title="Top-performing merchants"
        subtitle="Ranked by transaction volume during this period"
        aside={
          <a
            href="#"
            className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md px-2 text-body text-fg-2 transition-colors hover:bg-veil-2 hover:text-fg-1"
          >
            View all merchants
            <Icon icon={ArrowRight01Icon} className="text-fg-3" />
          </a>
        }
      />
      <table aria-labelledby="merchants-title" className="w-full table-fixed text-body">
        <colgroup>
          <col />
          <col className="w-[140px]" />
          <col className="w-[140px]" />
          <col className="w-[176px]" />
          <col className="w-[140px]" />
          <col className="w-[96px]" />
        </colgroup>
        <thead>
          <tr className="border-y border-line text-fg-3">
            <th scope="col" className={`${th} pl-5 text-left`}>
              Merchant
            </th>
            <th scope="col" className={`${th} text-left`}>
              Country
            </th>
            <th scope="col" className={`${th} text-left`}>
              Category
            </th>
            <th scope="col" className={`${th} text-left`}>
              Last transaction
            </th>
            <th scope="col" aria-sort="descending" className={`${th} text-right`}>
              <span className="inline-flex items-center gap-1 text-fg-2">
                Volume
                <Icon icon={ArrowDown01Icon} size={12} />
              </span>
            </th>
            <th scope="col" className={`${th} pr-5 text-right`}>
              Share
            </th>
          </tr>
        </thead>
        <tbody>
          {MERCHANTS.map((m) => (
            <tr key={m.email} className="transition-colors hover:bg-veil-1">
              <td className="h-[52px] pl-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-red/12 text-micro font-medium text-red"
                  >
                    {m.initials}
                  </span>
                  <span className="min-w-0">
                    <Truncate className="font-medium text-fg-1">{m.name}</Truncate>
                    <Truncate className="text-small text-fg-3">{m.email}</Truncate>
                  </span>
                </div>
              </td>
              <td className="text-fg-2">
                <Truncate>{m.country}</Truncate>
              </td>
              <td>
                <Pill>{m.category}</Pill>
              </td>
              <td className="text-fg-2 tabular-nums">
                <Truncate>{m.last}</Truncate>
              </td>
              <td className="text-right font-medium text-fg-1 tabular-nums">{m.volume}</td>
              <td className="pr-5 text-right text-fg-2 tabular-nums">{m.share}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

/* ---------- Page ---------- */

export default function App() {
  return (
    <div className="app-bg flex h-full min-w-[1440px]">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden pr-2 pb-2">
        <TopRow />
        {/* The sheet: one square, raised surface holding all page content; it scrolls, the top row stays */}
        <div className="sheet min-h-0 flex-1 overflow-y-auto rounded-xl border border-line-strong">
          <div className="relative flex flex-col gap-3 px-6 pt-7 pb-10">
            {/* Sheet margins from the original: dotted guide on the left, diagonal hatch on the right */}
            <span aria-hidden="true" className="guide-dots pointer-events-none absolute inset-y-0 left-[18px] w-px" />
            <span aria-hidden="true" className="gutter-hatch pointer-events-none absolute inset-y-0 right-0 w-[15px]" />
            <div className="mb-3 flex items-end justify-between gap-6 px-5">
              <div className="min-w-0">
                <h1 className="text-h3 font-semibold text-fg-1">Analytics</h1>
                <p className="mt-1 flex items-center gap-2 text-body text-fg-3">
                  Amounts in EUR
                  <span aria-hidden="true" className="size-[3px] rounded-full bg-fg-4" />
                  Compared with previous 30 days
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" className={secondaryBtn} aria-label="Date range: Aug 29 to Sep 27, 2026">
                  <Icon icon={Calendar03Icon} className="text-fg-3" />
                  <span className="tabular-nums">Aug 29 – Sep 27, 2026</span>
                  <Icon icon={ArrowDown01Icon} size={12} className="text-fg-3" />
                </button>
                <button type="button" className={secondaryBtn}>
                  <Icon icon={Download04Icon} className="text-fg-3" />
                  Export report
                </button>
              </div>
            </div>

            <KpiCard />

            <div className="grid grid-cols-2 gap-3">
              <CurrencyCard />
              <CountryCard />
            </div>

            <MerchantsCard />
          </div>
        </div>
      </main>
      <div aria-hidden="true" className="grain" />
    </div>
  )
}
