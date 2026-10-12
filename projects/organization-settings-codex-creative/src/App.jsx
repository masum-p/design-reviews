import {useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {Settings02Icon,UserMultipleIcon,UserGroupIcon,LockKeyIcon,PuzzleIcon,CreditCardIcon,UserCircleIcon,ArrowDown01Icon,Globe02Icon,AiSearch02Icon,Idea01Icon,File01Icon} from '@hugeicons/core-free-icons';
const Icon=({icon,size=18})=><HugeiconsIcon icon={icon} size={size} strokeWidth={1.5}/>;
export default function App(){
 const [name,setName]=useState('Halal Lab'),[saved,setSaved]=useState('Halal Lab'),[ai,setAi]=useState([true,true]),[notice,setNotice]=useState('');
 const save=()=>{setSaved(name.trim());setNotice('Organization name saved.');};
 return <div className="app">
  <aside>
   <div className="brand"><span className="brand-mark">N</span>Nexus<span className="brand-dot"/></div>
   <div className="workspace"><span className="org-avatar">H</span><div>{saved}<small>Organization</small></div><Icon icon={ArrowDown01Icon} size={14}/></div>
   <div className="nav-caption">Workspace settings</div>
   <nav>{[[Settings02Icon,'General'],[UserMultipleIcon,'Members'],[UserGroupIcon,'Teams'],[LockKeyIcon,'Security & SSO'],[PuzzleIcon,'Integrations'],[CreditCardIcon,'Billing']].map(([icon,label],i)=><div key={label} className={'nav-item '+(!i?'selected':'')} aria-current={!i?'page':undefined}><Icon icon={icon}/>{label}</div>)}</nav>
   <div className="aside-bottom"><div className="nav-item"><Icon icon={UserCircleIcon}/>Personal settings</div><p>Organization changes apply<br/>to everyone in Halal Lab.</p></div>
  </aside>
  <main>
   <header className="page-title"><div><div className="eyebrow">HALAL LAB</div><h1>Make it your workspace.</h1><p>Manage your organization’s identity, intelligence, and public presence.</p></div><span className="page-location">General settings</span></header>
   <div className="layout">
    <div className="primary">
     <section className="identity"><div className="section-top"><h2>Organization identity</h2><span className="scope">Visible to members</span></div>
      <div className="logo-block"><span className="logo">H<span className="logo-dot"/></span><div><h3>Your organization logo</h3><p>A familiar mark for your workspace.</p><button className="text-button">Upload image</button></div></div>
      <label htmlFor="name">Organization name</label><div className="name-row"><input id="name" value={name} onChange={e=>setName(e.target.value)}/><button className="button save" disabled={!name.trim()||name.trim()===saved} onClick={save}>Save name</button></div><p className="helper">Shown in the workspace switcher and to your members.</p>
     </section>
     <section className="intelligence"><div className="section-top"><h2>Workspace intelligence</h2><span className="scope">For your team</span></div><p className="section-description">Choose how AI helps members work with your content.</p>
      {[[AiSearch02Icon,'AI search','Ask questions about organization content in natural language.'],[Idea01Icon,'Content insights','Find useful themes and conflicting information within a space.']].map(([icon,title,desc],i)=><div className="feature" key={title}><span className="feature-icon"><Icon icon={icon}/></span><div><h3>{title}</h3><p>{desc}</p></div><button className="switch" role="switch" aria-label={title} aria-checked={ai[i]} onClick={()=>{setAi(ai.map((v,n)=>n===i?!v:v));setNotice(`${title} ${ai[i]?'disabled':'enabled'}.`);}}><span/></button></div>)}
      <p className="footnote">Search on published sites is configured separately.</p>
     </section>
     <div className="technical"><span>Organization ID</span><button disabled title="No organization ID supplied in this preview">Copy ID</button></div>
    </div>
    <section className="publishing"><div className="publish-heading"><span className="globe"><Icon icon={Globe02Icon} size={21}/></span><div><h2>Your public site</h2><p>Where your content lives.</p></div></div>
     <div className="domain"><span className="tiny-label">WORKSPACE ADDRESS</span><p>halal-lab-organization<span>.nexus.io</span></p><button className="button">Edit address</button></div>
     <div className="publish-setting"><h3>Use your own domain</h3><p>No custom domain connected. Publish under an address your audience knows.</p><button className="button wide">Connect domain</button></div>
     <div className="publish-setting homepage"><span><Icon icon={File01Icon}/></span><div><h3>Homepage</h3><p>First public page</p><button className="text-button">Choose a page</button></div></div>
    </section>
   </div>
   <div className="feedback" role="status" aria-live="polite">{notice}</div>
  </main>
 </div>
}
