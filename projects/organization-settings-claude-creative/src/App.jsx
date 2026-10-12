import {useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {
  UserCircleIcon, UserAccountIcon, Notification01Icon, Briefcase01Icon, SourceCodeIcon,
  PaintBoardIcon, AtIcon,
  Settings02Icon, UserMultipleIcon, UserGroupIcon, LockKeyIcon, PuzzleIcon,
  Layers01Icon, CubeIcon, CreditCardIcon,
  Logout03Icon, ArrowDown01Icon,
} from '@hugeicons/core-free-icons';

const I = ({icon, size = 17}) => (
  <HugeiconsIcon icon={icon} size={size} strokeWidth={1.6}/>
);

/* The Halal Lab mark. Two sizes only: 20px as the scope header in the
   navigation, 64px as the actual logo in the Identity band. It is the one
   graphic on the page, so nothing else competes with it. */
const Mark = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.4 4.4v15.2"/>
      <path d="M7.4 13.4 15.8 6.4"/>
      <path d="M11.1 11.3 16.4 19.6"/>
    </g>
  </svg>
);

/* Same three scopes as the source, in the same order. "Settings" is stated
   once at the top of the column so the group labels do not have to repeat
   it three times. */
const scopes = [
  ['Personal', [
    ['Profile', UserCircleIcon],
    ['Account', UserAccountIcon],
    ['Notifications', Notification01Icon],
    ['Organizations', Briefcase01Icon],
    ['Dev settings', SourceCodeIcon],
    ['Appearance', PaintBoardIcon],
    ['Shortcuts', AtIcon],
  ]],
  ['Organization', [
    ['General', Settings02Icon, true],
    ['Members', UserMultipleIcon],
    ['Teams', UserGroupIcon],
    ['SSO', LockKeyIcon],
    ['Integrations', PuzzleIcon],
  ]],
  ['Billing', [
    ['Plans', Layers01Icon],
    ['Subscriptions', CubeIcon],
    ['Billing', CreditCardIcon],
  ]],
];

/* Helper copy sits with the feature, because each sentence carries
   something the label does not. */
const aiFeatures = [
  ['AI search',
    'Members can ask questions about content in this organization. Search on your published site is configured separately.'],
  ['Content insights',
    'Find themes and conflicting information within a space.'],
];

/* Publishing is state, not prose: each row is a label, the value in force
   today, and the verb that changes it. The rationale lives once in the
   section gutter. */
const publishing = [
  ['Subdomain', 'halal-lab-organization.nexus.io', false, 'Edit', 'Edit subdomain'],
  ['Custom domain', 'Not connected', true, 'Connect', 'Connect a custom domain'],
  ['Homepage', 'First public page', false, 'Choose', 'Choose the homepage'],
];

/* One geometry for every row on the page: label, value, action. The action
   cell is right-aligned and width-matched, so all four kinds of control
   land on a single edge. */
const Row = ({label, htmlFor, children, action}) => (
  <div className="row">
    {htmlFor
      ? <label className="row-label" htmlFor={htmlFor}>{label}</label>
      : <div className="row-label">{label}</div>}
    <div className="row-value">{children}</div>
    <div className="row-action">{action}</div>
  </div>
);

const Band = ({title, blurb, children}) => (
  <section className="band">
    <div className="band-gutter">
      <h2>{title}</h2>
      <p>{blurb}</p>
    </div>
    <div className="band-rows">{children}</div>
  </section>
);

export default function App(){
  const [name,setName]=useState('Halal Lab');
  const [savedName,setSavedName]=useState('Halal Lab');
  const [enabled,setEnabled]=useState([true,true]);
  const [saved,setSaved]=useState(false);
  const dirty = name.trim().length > 0 && name.trim() !== savedName;

  return (
    <div className="app">
      <nav className="sidebar" aria-label="Settings">
        <div className="sidebar-head">Settings</div>

        {scopes.map(([scope, items], si) => (
          <div className="scope" key={scope}>
            <h2 className="scope-label">{scope}</h2>

            {/* Named once, at the head of the scope it governs, so the
                items below it need no qualifier. */}
            {si === 1 && (
              <div className="scope-org">
                <span className="avatar avatar-sm"><Mark size={11}/></span>
                <span className="scope-org-name">{savedName}</span>
                <span className="scope-org-chevron"><I icon={ArrowDown01Icon} size={15}/></span>
              </div>
            )}

            {items.map(([item, icon, current]) => (
              <div className={current ? 'nav-item is-current' : 'nav-item'} key={item}
                   aria-current={current ? 'page' : undefined}>
                <I icon={icon}/>
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="sidebar-foot">
          <div className="nav-item nav-logout"><I icon={Logout03Icon}/><span>Log out</span></div>
        </div>
      </nav>

      <main className="main">
        <div className="content">
          <header className="page-head">
            <h1>General</h1>
            <p>Settings that apply across {savedName}.</p>
          </header>

          <Band title="Identity" blurb="The logo and name members see across this organization.">
            <Row label="Logo" action={<button type="button" className="btn" aria-label="Upload organization logo">Upload</button>}>
              <div className="logo-value">
                <span className="avatar avatar-lg"><Mark size={30}/></span>
                <p className="hint">At least 132px square, image rather than text.</p>
              </div>
            </Row>

            <Row label="Display name" htmlFor="display-name"
                 action={
                   <button type="button" className="btn btn-primary" disabled={!dirty}
                     onClick={()=>{const v=name.trim();setSavedName(v);setName(v);setSaved(true);}}>Save</button>
                 }>
              <input id="display-name" value={name} autoComplete="off"
                onChange={e=>{setName(e.target.value);setSaved(false);}}/>
              <p className="status" role="status" aria-live="polite">{saved ? 'Name saved.' : ''}</p>
            </Row>
          </Band>

          <Band title="AI features" blurb="Assistive features for members working in this organization.">
            {aiFeatures.map(([title, helper], i) => (
              <Row key={title} label={title}
                   action={
                     <button type="button" role="switch" className="switch"
                       aria-checked={enabled[i]} aria-label={title}
                       onClick={()=>setEnabled(enabled.map((v,j)=>j===i?!v:v))}><i/></button>
                   }>
                <p className="hint">{helper}</p>
              </Row>
            ))}
          </Band>

          <Band title="Publishing" blurb="Where published content lives, and the page visitors open first.">
            {publishing.map(([label, value, unset, verb, described]) => (
              <Row key={label} label={label}
                   action={<button type="button" className="btn" aria-label={described}>{verb}</button>}>
                <p className={unset ? 'value is-unset' : 'value'}>{value}</p>
              </Row>
            ))}
          </Band>
        </div>
      </main>
    </div>
  );
}
