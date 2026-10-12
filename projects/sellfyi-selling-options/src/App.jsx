import {useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {
  FlashIcon, ArrowLeftDoubleIcon, Search01Icon, Notification01Icon, UserCircleIcon,
  Grid02Icon, Message01Icon, StarIcon, Wallet01Icon, ArrowLeft02Icon, ReturnRequestIcon,
  UserMultiple02Icon, Analytics01Icon, Megaphone01Icon,
  Package01Icon, Invoice01Icon, Coupon01Icon, DeliveryTruck01Icon,
  Settings02Icon, HeadsetIcon, ChartHistogramIcon, ToolsIcon,
  Settings01Icon, ShoppingCart01Icon, MoneyReceive01Icon, Layout01Icon, PaintBoardIcon,
  ShieldKeyIcon, SmartPhone01Icon, Mail01Icon, Share01Icon,
  ArrowDown01Icon, Tick02Icon,
} from '@hugeicons/core-free-icons';

const I = ({icon, size = 17, strokeWidth = 1.6}) => (
  <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth}/>
);

/* ---------------------------------------------------------------- data ---
   Navigation keeps the source order, grouping and labels. Nothing here
   navigates; Settings and Selling Options are the two selected items. */
const mainNav = [
  ['Main menu', [
    ['Dashboard', Grid02Icon],
    ['Request Quotes', Message01Icon],
    ['Reviews', StarIcon],
    ['Withdraw', Wallet01Icon],
    ['Reverse Withdrawal', ArrowLeft02Icon],
    ['Return Request', ReturnRequestIcon],
    ['Staff', UserMultiple02Icon],
    ['Analytics', Analytics01Icon],
    ['Announcements', Megaphone01Icon],
  ]],
  ['Sales and fulfillments', [
    ['Product', Package01Icon],
    ['Orders', Invoice01Icon],
    ['Coupons', Coupon01Icon],
    ['Delivery Time', DeliveryTruck01Icon],
  ]],
  ['Platform features', [
    ['Settings', Settings02Icon],
    ['Support', HeadsetIcon],
    ['Reports', ChartHistogramIcon],
    ['Tools', ToolsIcon],
  ]],
];

const settingsNav = [
  ['General', Settings01Icon],
  ['Selling Options', ShoppingCart01Icon],
  ['Withdraw Options', MoneyReceive01Icon],
  ['Page Settings', Layout01Icon],
  ['Appearance', PaintBoardIcon],
  ['Seller Verification', ShieldKeyIcon],
  ['Verification SMS Gateways', SmartPhone01Icon],
  ['Email Verification', Mail01Icon],
  ['Social API', Share01Icon],
  ['Vendor Contact Form', UserCircleIcon],
];

/* The eight settings, with the values the reference screen shipped.
   The two "Disable ..." rows were unchecked, so the popup and the wizard
   were both in use; stated positively that is `true` on both. */
const initial = {
  newVendorUpload: true,
  welcomeWizard: true,
  commissionType: 'percentage',
  adminCommission: '10',
  orderStatusChange: true,
  productPopup: true,
  categorySelection: 'single',
  vendorTags: true,
};

/* ------------------------------------------------------------ controls --- */
const Switch = ({checked, onChange, labelledBy}) => (
  <button type="button" role="switch" aria-checked={checked} aria-labelledby={labelledBy}
    className="switch" onClick={() => onChange(!checked)}>
    <i/>
  </button>
);

const Select = ({value, onChange, options, labelledBy}) => (
  <div className="select">
    <select value={value} aria-labelledby={labelledBy} onChange={e => onChange(e.target.value)}>
      {options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
    </select>
    <span className="select-chevron"><I icon={ArrowDown01Icon} size={15}/></span>
  </div>
);

/* A rate is a number, so it is typed, not picked from a menu. The affix
   follows Commission type: percent of the order, or a flat amount. */
const RateField = ({value, onChange, percent, id}) => (
  <div className="rate">
    {!percent && <span className="rate-affix rate-prefix">$</span>}
    <input id={id} type="text" inputMode="decimal" value={value}
      onChange={e => onChange(e.target.value.replace(/[^\d.]/g, '').slice(0, 6))}/>
    {percent && <span className="rate-affix">%</span>}
  </div>
);

/* One row shape for all eight settings: label and helper on the left,
   control right-aligned to a single edge. */
const Row = ({id, label, help, children}) => (
  <div className="row">
    <div className="row-text">
      <span className="row-label" id={`${id}-label`}>{label}</span>
      <p>{help}</p>
    </div>
    <div className="row-control">{children}</div>
  </div>
);

const Group = ({title, children}) => (
  <section className="group">
    <h2>{title}</h2>
    <div className="card">{children}</div>
  </section>
);

const navItems = (items) => items.map(([name, icon]) => (
  <div key={name} className={`nav-item${name === 'Settings' ? ' is-selected' : ''}`}>
    <I icon={icon} size={17}/>
    <span>{name}</span>
  </div>
));

/* ---------------------------------------------------------------- app --- */
export default function App() {
  const [globalQuery, setGlobalQuery] = useState('');
  const [settingsQuery, setSettingsQuery] = useState('');
  const matches = (name, query) => name.toLowerCase().includes(query.trim().toLowerCase());
  const globalGroups = (globalQuery.trim() ? [...mainNav, ['Settings sections', settingsNav]] : mainNav)
    .map(([label, items]) => [label, items.filter(([name]) => matches(name, globalQuery))])
    .filter(([, items]) => items.length);
  const visibleSettings = settingsNav.filter(([name]) => matches(name, settingsQuery));
  /* Search is a row of the first group, so that group's heading and the
     search row stay mounted while the query filters the rows under them. */
  const [firstLabel] = mainNav[0];
  const firstItems = globalGroups.find(([label]) => label === firstLabel)?.[1] ?? [];
  const laterGroups = globalGroups.filter(([label]) => label !== firstLabel);
  const [v, setV] = useState(initial);
  const [base, setBase] = useState(initial); // last saved values
  const [saved, setSaved] = useState(false);
  const set = (key) => (value) => {
    setV(prev => ({...prev, [key]: value}));
    setSaved(false);
  };

  const dirty = Object.keys(base).filter(k => v[k] !== base[k]);
  const percent = v.commissionType === 'percentage';
  const rate = v.adminCommission === '' ? '0' : v.adminCommission;

  return (
    <div className="app">
      {/* ------------------------------------------------ product sidebar */}
      <aside className="nav">
        <div className="brand">
          <span className="brand-mark"><I icon={FlashIcon} size={15} strokeWidth={2}/></span>
          <span className="brand-name">Sellfyi</span>
          <button type="button" className="brand-collapse" aria-label="Collapse sidebar">
            <I icon={ArrowLeftDoubleIcon} size={16}/>
          </button>
        </div>

        <div className="nav-scroll">
          <div className="nav-group">
            <div className="search sidebar-search global-search">
              <I icon={Search01Icon} size={16}/>
              <input type="search" placeholder="Search" aria-label="Search"
                value={globalQuery} onChange={e => setGlobalQuery(e.target.value)}
                onKeyDown={e => {if (e.key === 'Escape') setGlobalQuery('');}}/>
            </div>
            {navItems(firstItems)}
          </div>
          {laterGroups.map(([label, items]) => (
            <div className="nav-group" key={label}>
              {navItems(items)}
            </div>
          ))}
          {globalGroups.length === 0 && <p className="search-empty" role="status">No matching pages</p>}
        </div>
      </aside>

      <div className="shell">
        {/* ------------------------------------------------------- header */}
        <header className="topbar">
          <h1 className="topbar-title">Settings</h1>
          <button type="button" className="icon-button" aria-label="Notifications">
            <I icon={Notification01Icon} size={18}/>
          </button>
          <button type="button" className="shop-chip">
            My Shop
            <I icon={UserCircleIcon} size={18}/>
          </button>
        </header>

        <div className="body">
          {/* --------------------------------------------- settings pages */}
          <nav className="subnav" aria-label="Settings sections">
            <div className="search sidebar-search settings-search">
              <I icon={Search01Icon} size={16}/>
              <input type="search" placeholder="Search settings" aria-label="Search settings"
                value={settingsQuery} onChange={e => setSettingsQuery(e.target.value)}
                onKeyDown={e => {if (e.key === 'Escape') setSettingsQuery('');}}/>
            </div>
            {visibleSettings.length === 0 && <p className="search-empty" role="status">No matching settings</p>}
            {visibleSettings.map(([name, icon]) => (
              <div key={name}
                className={`subnav-item${name === 'Selling Options' ? ' is-selected' : ''}`}
                aria-current={name === 'Selling Options' ? 'page' : undefined}>
                <I icon={icon} size={17}/>
                <span>{name}</span>
              </div>
            ))}
          </nav>

          {/* ----------------------------------------------- the settings */}
          <main className="main">
            <div className="main-scroll">
              <div className="content">
                <div className="page-head">
                  <h2>Selling Options</h2>
                  <p>What vendors can do on your marketplace, and what you earn from their sales.</p>
                </div>

                <Group title="New vendor onboarding">
                  <Row id="upload" label="Product upload"
                    help="Newly registered vendors can add products right away.">
                    <Switch checked={v.newVendorUpload} onChange={set('newVendorUpload')}
                      labelledBy="upload-label"/>
                  </Row>
                  <Row id="wizard" label="Welcome wizard"
                    help="New vendors are walked through store setup on first sign in.">
                    <Switch checked={v.welcomeWizard} onChange={set('welcomeWizard')}
                      labelledBy="wizard-label"/>
                  </Row>
                </Group>

                <Group title="Commission">
                  <Row id="ctype" label="Commission type"
                    help="How your cut of each sale is calculated.">
                    <Select value={v.commissionType} onChange={set('commissionType')}
                      labelledBy="ctype-label"
                      options={[['percentage', 'Percentage'], ['flat', 'Flat amount']]}/>
                  </Row>
                  <Row id="rate" label="Admin commission"
                    help={percent
                      ? `You keep ${rate}% of each order total.`
                      : `You keep $${rate} from each order.`}>
                    <RateField id="rate-input" value={v.adminCommission}
                      onChange={set('adminCommission')} percent={percent}/>
                  </Row>
                </Group>

                <Group title="Products and orders">
                  <Row id="status" label="Order status change"
                    help="Vendors can move their own orders through processing and completion.">
                    <Switch checked={v.orderStatusChange} onChange={set('orderStatusChange')}
                      labelledBy="status-label"/>
                  </Row>
                  <Row id="popup" label="Add product in a popup"
                    help="Vendors create products in a quick popup instead of a full page.">
                    <Switch checked={v.productPopup} onChange={set('productPopup')}
                      labelledBy="popup-label"/>
                  </Row>
                  <Row id="cat" label="Category selection"
                    help="How many categories a vendor can put a product in.">
                    <Select value={v.categorySelection} onChange={set('categorySelection')}
                      labelledBy="cat-label"
                      options={[['single', 'Single'], ['multiple', 'Multiple']]}/>
                  </Row>
                  <Row id="tags" label="Vendors can create tags"
                    help="New product tags can be added from the vendor dashboard.">
                    <Switch checked={v.vendorTags} onChange={set('vendorTags')}
                      labelledBy="tags-label"/>
                  </Row>
                </Group>
              </div>
            </div>

            {/* Actions sit on one line with the content column, so the page
                ends with the settings rather than with empty border. */}
            <div className="actionbar">
              <div className="content actionbar-inner">
                <p className="actionbar-status">
                  {dirty.length === 0
                    ? (saved
                      ? <><span className="status-tick"><I icon={Tick02Icon} size={14} strokeWidth={2}/></span>Changes saved</>
                      : 'All changes saved')
                    : `${dirty.length} unsaved ${dirty.length === 1 ? 'change' : 'changes'}`}
                </p>
                <div className="actionbar-buttons">
                  <button type="button" className="btn" disabled={dirty.length === 0}
                    onClick={() => {setV(base); setSaved(false);}}>Discard</button>
                  <button type="button" className="btn btn-primary" disabled={dirty.length === 0}
                    onClick={() => {setBase(v); setSaved(true);}}>Save changes</button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
