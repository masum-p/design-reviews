import {HugeiconsIcon} from '@hugeicons/react';
import {
  DashboardSquare01Icon,
  CheckmarkCircle02Icon,
  Wallet01Icon,
  Store01Icon,
  Exchange01Icon,
  Analytics01Icon,
  File01Icon,
  CreditCardIcon,
  UserGroupIcon,
  Settings01Icon,
  Search01Icon,
  Notification02Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  Add01Icon,
  Calendar03Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons';

const Icon = ({icon, size = 16, ...rest}) => (
  <HugeiconsIcon icon={icon} size={size} strokeWidth={1.6} {...rest} />
);

const primaryNav = [
  ['Dashboard', DashboardSquare01Icon],
  ['Action center', CheckmarkCircle02Icon],
  ['Finances', Wallet01Icon],
  ['Platforms', Store01Icon],
  ['Configuration & Fees', Exchange01Icon],
  ['Analytics', Analytics01Icon],
  ['Statements', File01Icon],
  ['Billing', CreditCardIcon],
  ['Merchants', UserGroupIcon],
  ['Settings', Settings01Icon],
];

const sectionNav = [
  'Users',
  'Accounts',
  'Transfers',
  'Cards',
  'Cryptocurrencies',
  'Earn',
  'Trust',
  'Tokens',
  'Compliance',
  'Support',
];

const metrics = [
  ['Transaction volume', '€148,698.40', '12.0%', 'up'],
  ['Net earnings', '€54,481.58', '8.2%', 'up'],
  ['Fees earned', '€5,328.56', '12.0%', 'up'],
  ['Payout success rate', '98.6%', '1.2 pp', 'up'],
  ['Chargeback rate', '0.42%', '0.08 pp', 'down'],
  ['Rolling balance', '€924,398.90', 'End of period', 'flat'],
];

const currencies = [
  ['$', 'US dollar (USD)', 34, '€18,524.48'],
  ['€', 'Euro (EUR)', 24, '€13,075.20'],
  ['¥', 'Japanese yen (JPY)', 18, '€9,806.40'],
  ['£', 'British pound (GBP)', 12, '€6,537.60'],
  ['₴', 'Ukrainian hryvnia (UAH)', 8, '€4,358.70'],
  ['₽', 'Russian ruble (RUB)', 4, '€2,179.20'],
];

const markets = [
  ['US', 'United States', 48, '€71,375'],
  ['IN', 'India', 22, '€32,714'],
  ['JP', 'Japan', 18, '€26,766'],
  ['GB', 'United Kingdom', 12, '€17,844'],
];

const merchants = [
  ['AC', 'ABC Corporation', 'hello@abccorp.com', 'Brazil', 'Agency', 'Today, 4:24 PM', '€32,480.00', '21.8%', 'violet'],
  ['HL', 'Hlab UX LLC', 'accounts@halallab.co', 'Burundi', 'Design', 'Today, 1:24 PM', '€28,640.00', '19.3%', 'orange'],
  ['D', 'Dianne & Co.', 'michael@dianne.com', 'UAE', 'Clothing', 'Today, 12:24 PM', '€21,350.00', '14.4%', 'blue'],
  ['RR', 'Ronald Richards', 'tanyahill@rrc.com', 'United States', 'Electronics', 'Today, 11:48 AM', '€18,920.00', '12.7%', 'green'],
];

const currencyPeak = currencies[0][2];
const marketPeak = markets[0][2];

function Metric({label, value, change, direction}) {
  return (
    <article className="metric">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {direction === 'flat' ? (
        <div className="metric-delta neutral">{change}</div>
      ) : (
        <div className={'metric-delta ' + (direction === 'up' ? 'positive' : 'negative-good')}>
          <Icon icon={direction === 'up' ? ArrowUpRight01Icon : ArrowDownRight01Icon} size={13} />
          {change}
        </div>
      )}
    </article>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Paymie</div>
        <button className="create-transfer">
          <Icon icon={Add01Icon} size={15} />
          Create Transfer
        </button>
        <nav className="nav-primary" aria-label="Primary">
          {primaryNav.map(([label, icon]) => (
            <button
              key={label}
              className={'nav-item' + (label === 'Analytics' ? ' selected' : '')}
              aria-current={label === 'Analytics' ? 'page' : undefined}
            >
              <Icon icon={icon} size={16} />
              {label}
            </button>
          ))}
        </nav>
        <div className="nav-divider" />
        <nav className="nav-sections" aria-label="Account areas">
          {sectionNav.map((label) => (
            <button key={label} className="section-item">
              {label}
              <Icon icon={ArrowRight01Icon} size={14} />
            </button>
          ))}
        </nav>
      </aside>

      <main>
        <header className="topbar">
          <div className="topbar-title">
            <h1>Analytics</h1>
            <button className="range">
              <Icon icon={Calendar03Icon} size={15} />
              Last 30 days
              <Icon icon={ArrowDown01Icon} size={13} />
            </button>
          </div>
          <div className="topbar-actions">
            <div className="search">
              <Icon icon={Search01Icon} size={15} />
              <span>Search</span>
              <kbd>/</kbd>
            </div>
            <button className="ghost-button">
              <Icon icon={Download01Icon} size={15} />
              Export
            </button>
            <button className="bell" aria-label="Notifications">
              <Icon icon={Notification02Icon} size={17} />
              <i />
            </button>
            <span className="avatar">AM</span>
          </div>
        </header>

        <div className="page">
          <p className="context-line">
            Amounts in EUR<span className="dot">·</span>Compared with the previous 30 days
          </p>

          <section className="metrics" aria-label="Key metrics">
            {metrics.map(([label, value, change, direction]) => (
              <Metric key={label} label={label} value={value} change={change} direction={direction} />
            ))}
          </section>

          <section className="breakdowns">
            <article className="panel">
              <div className="panel-head">
                <div>
                  <h2>Net earnings by currency</h2>
                  <p>Share of net earnings, converted to EUR at settlement</p>
                </div>
                <strong className="panel-total">€54,481.58</strong>
              </div>
              <div className="currency-head">
                <span>Currency</span>
                <span>Share</span>
                <span>Net earnings</span>
              </div>
              <div className="currency-list">
                {currencies.map(([symbol, name, share, value]) => (
                  <div className="currency-row" key={name}>
                    <div className="currency-name">
                      <span className="symbol">{symbol}</span>
                      {name}
                    </div>
                    <div className="share-cell">
                      <span className="bar">
                        <i style={{width: (share / currencyPeak) * 100 + '%'}} />
                      </span>
                      <span className="share-value">{share}%</span>
                    </div>
                    <span className="amount">{value}</span>
                  </div>
                ))}
              </div>
              <div className="panel-foot">Six settlement currencies active this period</div>
            </article>

            <article className="panel">
              <div className="panel-head">
                <div>
                  <h2>Transactions by country</h2>
                  <p>Share of total transaction volume</p>
                </div>
                <strong className="panel-total">€148,698.40</strong>
              </div>
              <div className="country-list">
                {markets.map(([code, name, share, value]) => (
                  <div className="country-row" key={code}>
                    <span className="code-chip">{code}</span>
                    <div className="country-body">
                      <div className="country-line">
                        <span className="country-name">{name}</span>
                        <span className="amount">{value}</span>
                      </div>
                      <div className="country-track">
                        <span className="bar wide">
                          <i style={{width: (share / marketPeak) * 100 + '%'}} />
                        </span>
                        <span className="share-value">{share}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="panel-foot">
                The United States accounts for close to half of all volume
              </div>
            </article>
          </section>

          <section className="panel merchant-panel">
            <div className="panel-head">
              <div>
                <h2>Top performing merchants</h2>
                <p>Ranked by transaction volume during this period</p>
              </div>
              <button className="link-button">
                View all merchants
                <Icon icon={ArrowRight01Icon} size={14} />
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th scope="col">Merchant</th>
                  <th scope="col">Country</th>
                  <th scope="col">Category</th>
                  <th scope="col">Last transaction</th>
                  <th scope="col" className="right">Volume</th>
                  <th scope="col" className="right">Share</th>
                </tr>
              </thead>
              <tbody>
                {merchants.map(([initials, name, email, country, category, time, value, share, tone]) => (
                  <tr key={name}>
                    <td>
                      <div className="merchant">
                        <span className={'merchant-logo ' + tone}>{initials}</span>
                        <div>
                          <strong>{name}</strong>
                          <small>{email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{country}</td>
                    <td>
                      <span className="tag">{category}</span>
                    </td>
                    <td className="muted">{time}</td>
                    <td className="right amount strong">{value}</td>
                    <td className="right muted">{share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="panel-foot split">
              <span>Top 4 of 28 active merchants</span>
              <span>
                These merchants represent <strong>68.2%</strong> of total volume
              </span>
            </div>
          </section>

          <footer className="page-footer">
            <span>Paymie Analytics</span>
            <span>Figures on this screen are illustrative sample data, not live reporting</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
