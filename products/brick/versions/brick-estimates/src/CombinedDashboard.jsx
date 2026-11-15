import { Search01Icon, ArrowDown01Icon, PlusSignIcon, Calendar03Icon, FilterHorizontalIcon, PlayCircleIcon } from '@hugeicons-pro/core-stroke-standard'
import Sidebar from './components/StandardSidebar'
import Icon from './ui/Icon'
import { researchCards } from './research-data'
import './codex-research.css'
import { CombinedCard } from './CombinedCards'
export default function CombinedDashboard(){const variant=new URLSearchParams(location.search).get("variant")||"1";return <div className={"notion-research cc-dashboard cc-version-"+variant}><Sidebar estimateCount={20} reference/><main className="nr-main"><header className="nr-page-head"><div><h1>Estimates</h1><button className="nr-tutorial"><Icon icon={PlayCircleIcon} size={16}/>Tutorial Video</button></div><div className="nr-header-actions"><button><Icon icon={Calendar03Icon} size={16}/>May 1 – May 21, 2024<Icon icon={ArrowDown01Icon} size={13}/></button><button><Icon icon={FilterHorizontalIcon} size={16}/>Filter Estimates<Icon icon={ArrowDown01Icon} size={13}/></button><button className="nr-primary"><Icon icon={PlusSignIcon} size={17}/>New Estimate</button></div></header>
<div className="nr-toolbar"><label><Icon icon={Search01Icon} size={16}/><input placeholder="Search Estimate…" aria-label="Search Estimate"/></label></div>
<nav className="nr-tabs" aria-label="Estimate categories">{[['All',20,'62.47'],['Draft',2,'10.12'],['Pending',3,'22.12'],['Paid',15,'18.12']].map(([label,count,total],i)=><button key={label} aria-current={i===0?'page':undefined}><span>{label}<small>{count}</small></span><strong>${total}k</strong></button>)}</nav>
<div className="cc-grid">{[2,3,5,0,1,4].map(i=><CombinedCard key={researchCards[i].id} card={researchCards[i]} variant={variant}/>)}</div></main></div>}