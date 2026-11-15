import {useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {
  UserCircleIcon, UserAccountIcon, Notification01Icon, Briefcase01Icon, SourceCodeIcon,
  Settings02Icon, UserMultipleIcon, UserGroupIcon,
  PaintBoardIcon, AtIcon, LockKeyIcon, PuzzleIcon,
  Layers01Icon, CubeIcon, CreditCardIcon, Logout03Icon,
  ArrowDown01Icon, Copy01Icon, Edit02Icon, Delete02Icon, Cancel01Icon,
  AiSearch02Icon, Idea01Icon, Globe02Icon, GlobalIcon, File01Icon,
} from '@hugeicons/core-free-icons';

const I = ({icon, size = 17, strokeWidth = 1.6}) => (
  <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth}/>
);

/* The Halal Lab mark. Drawn once and reused at 20px in the organization
   switcher and at 56px in the Organization Profile row, so both read as
   the same identity. */
const Mark = ({size}) => (
  <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.4 4.4v15.2"/>
      <path d="M7.4 13.4 15.8 6.4"/>
      <path d="M11.1 11.3 16.4 19.6"/>
    </g>
  </svg>
);

/* Navigation keeps the source order and grouping: the person's own
   settings first, then the organization they are currently inside, then
   the application, then billing. Only General is selected; nothing here
   navigates. */
const navGroups = [
  ['Personal settings', [
    ['Profile', UserCircleIcon],
    ['Account', UserAccountIcon],
    ['Notifications', Notification01Icon],
    ['Organizations', Briefcase01Icon],
    ['Dev Settings', SourceCodeIcon],
    ['Appearance', PaintBoardIcon],
    ['Shortcuts', AtIcon],
  ]],
  ['Organization settings', [
    ['General', Settings02Icon, true],
    ['Members', UserMultipleIcon],
    ['Teams', UserGroupIcon],
    ['SSO', LockKeyIcon],
    ['Integrations', PuzzleIcon],
  ]],
  ['Billing settings', [
    ['Plans', Layers01Icon],
    ['Subscriptions', CubeIcon],
    ['Billing', CreditCardIcon],
  ]],
];

const aiFeatures = [
  [AiSearch02Icon, 'AI search',
    'Let members ask questions about organization content. Published-site search is configured separately.'],
  [Idea01Icon, 'Content insights',
    'Help your team find insights and conflicting information within a space.'],
];

const publishing = [
  [Globe02Icon, 'Subdomain',
    'halal-lab-organization.nexus.io',
    'Edit Subdomain'],
  [GlobalIcon, 'Custom Domain',
    'Not connected. Use your own domain for published content.',
    'Connect Domain'],
  [File01Icon, 'Homepage',
    'Currently shows the first public page. Choose what visitors see when they open your site.',
    'Choose page'],
];

const Switch = ({label, checked, onChange}) => (
  <button type="button" role="switch" aria-checked={checked} onClick={onChange} aria-label={label} className="switch">
    <i/>
  </button>
);

/* One row shape serves both AI features and Publishing: quiet icon,
   title, helper capped at a comfortable measure, and the control kept on
   the far right so every control in the page shares one edge. */
const SettingRow = ({icon, title, helper, children}) => (
  <div className="row">
    <span className="row-icon"><I icon={icon} size={36} strokeWidth={1.04}/></span>
    <div className="row-text">
      <h3>{title}</h3>
      <p>{helper}</p>
    </div>
    <div className="row-action">{children}</div>
  </div>
);

export default function App(){
  const [name,setName]=useState('Halal Lab');
  const [savedName,setSavedName]=useState('Halal Lab');
  const [enabled,setEnabled]=useState([true,true]);
  const [feedback,setFeedback]=useState('');
  return (
    <div className="app">
      <nav className="sidebar" aria-label="Settings">
        {navGroups.map(([group, items], gi) => (
          <div className="nav-group" key={group}>
            <h2 className="nav-label">{group}</h2>

            {/* The organization being edited is named at the head of its
                own group, so "General" is unambiguous below it. */}
            {gi === 1 && (
              <div className="nav-item nav-org">
                <span className="avatar avatar-sm"><Mark size={20}/></span>
                <span>{savedName}</span>
                <span className="nav-chevron"><I icon={ArrowDown01Icon} size={16}/></span>
              </div>
            )}

            {items.map(([name, icon, selected]) => (
              <div className={selected ? 'nav-item is-selected' : 'nav-item'} key={name}>
                <I icon={icon}/>
                <span>{name}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="nav-group">
          <div className="nav-item nav-logout">
            <I icon={Logout03Icon}/>
            <span>Log Out</span>
          </div>
        </div>
      </nav>

      <main className="main">
        <div className="content">
          <h1>General</h1>
          <div className="settings-close"><button type="button" aria-label="Close settings" title="Close settings" className="close-button"><I icon={Cancel01Icon} size={20}/></button><span>ESC</span></div>

          <section>
            <header className="section-head">
              <h2>Organization Profile</h2>

            </header>

            <div className="settings-panel profile-panel"><div className="logo-row">
              <span className="avatar avatar-lg"><Mark size={56}/></span>
              <div className="row-text">
                <h3>Organization Logo</h3>
                <p>Use a photo or image rather than text, at least 132px square or round.</p>
              </div>
              <div className="row-action">
                <button type="button" className="btn logo-button"><I icon={Edit02Icon} size={14}/>Change logo</button>
                <button type="button" className="btn logo-button"><I icon={Delete02Icon} size={14}/>Remove logo</button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="display-name">Display Name</label>
              <p id="name-help" className="field-help">How your organization name appears to members</p>
              <div className="name-edit"><input id="display-name" value={name} onChange={e=>setName(e.target.value)} aria-describedby="name-help"/>
                <button className="btn" disabled={!name.trim() || name.trim()===savedName} onClick={()=>{setSavedName(name.trim());setName(name.trim());setFeedback('Organization name saved.');}}>Save</button></div>
              <div className="profile-meta"><button type="button" className="link-action" title="Organization ID is not available in this preview" disabled><I icon={Copy01Icon} size={14}/>Copy organization ID</button></div>
            </div>
            </div>
          </section>

          <hr/>

          <section>
            <h2>AI features</h2>
            <div className="settings-panel">
            {aiFeatures.map(([icon, title, helper], index) => (
              <SettingRow key={title} icon={icon} title={title} helper={helper}>
                <Switch label={title} checked={enabled[index]} onChange={()=>{setEnabled(enabled.map((v,i)=>i===index?!v:v));setFeedback(`${title} ${enabled[index]?'disabled':'enabled'}.`);}}/>
              </SettingRow>
            ))}
            </div>
          </section>

          <hr/>

          <section>
            <h2>Publishing</h2>
            <div className="settings-panel">
            {publishing.map(([icon, title, helper, action]) => (
              <SettingRow key={title} icon={icon} title={title} helper={helper}>
                <button type="button" className="btn">{action}</button>
              </SettingRow>
            ))}
            </div>
          </section>
          <div className="save-feedback" role="status" aria-live="polite">{feedback}</div>
        </div>
      </main>
    </div>
  );
}
