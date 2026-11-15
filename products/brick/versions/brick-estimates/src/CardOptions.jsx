import { MoreHorizontalIcon, PlusSignIcon, CheckmarkCircle01Icon, HourglassIcon, ThumbsUpIcon } from '@hugeicons-pro/core-stroke-standard'
import Icon from './ui/Icon'
import { researchCards } from './research-data'
import './card-options.css'

const data = researchCards[2]
const labels = ['Total invoiced', 'To be invoiced', 'Paid', 'Due']
function Status({ state = 'Accepted' }) { return <span className={`co-status co-${state.toLowerCase()}`}><Icon icon={state === 'Pending' ? HourglassIcon : state === 'Paid' ? CheckmarkCircle01Icon : ThumbsUpIcon} size={14}/>{state}</span> }
function Header() { return <header className="co-card-header"><div><h2>{data.client}</h2><p>#{data.id}<span>·</span>{data.date}</p></div><div className="co-header-actions"><Status/><button aria-label="More estimate options"><Icon icon={MoreHorizontalIcon}/></button></div></header> }
function Metric({ index }) { return <div className="co-metric"><dt>{labels[index]}</dt><dd>${data.figures[index]}</dd></div> }
function Progress({ ring = false }) { return ring ? <div className="co-ring" aria-label="Progress 60 percent"><span>60%</span></div> : <div className="co-progress" aria-label="Progress 60 percent"><div><i/></div><span>60%</span></div> }
function Ledger({ detailed = false }) { return <div className={`co-ledger ${detailed ? 'co-detailed' : ''}`}><div className="co-ledger-total"><strong>Estimate</strong><strong>${data.estimate}</strong><Icon icon={ThumbsUpIcon} size={16}/></div>{data.rows.map(([name, amount, status]) => <div className="co-ledger-row" key={name}><span>{name}</span><span>${amount}</span>{detailed ? <Status state={status === 'paid' ? 'Paid' : 'Pending'}/> : <span className={`co-${status}`} title={status === 'paid' ? 'Paid' : 'Pending'}><Icon icon={status === 'paid' ? CheckmarkCircle01Icon : HourglassIcon} size={16}/><span className="co-sr">{status}</span></span>}</div>)}</div> }
function Action() { return <footer className="co-footer"><button><Icon icon={PlusSignIcon} size={17}/>Add another invoice for this estimate</button></footer> }
function Card({ variant }) { return <article className={`co-card co-card-${variant}`}><Header/>{variant === 'a' ? <><div className="co-total"><div><span>Estimate total</span><strong>${data.total}</strong></div><Progress ring/></div><dl className="co-summary">{[0,1,2,3].map(index=><Metric key={index} index={index}/>)}</dl><Ledger/></> : variant === 'b' ? <><div className="co-total"><div><span>Estimate total</span><strong>${data.total}</strong></div></div><dl className="co-summary">{[0,1,2,3].map(index=><Metric key={index} index={index}/>)}</dl><Progress/><Ledger detailed/></> : <><div className="co-balance"><span>Due</span><strong>${data.figures[3]}</strong><div><span>To be invoiced</span><b>${data.figures[1]}</b></div></div><dl className="co-context"><div className="co-metric"><dt>Estimate total</dt><dd>${data.total}</dd></div><Metric index={0}/><Metric index={2}/></dl><Progress/><Ledger detailed/></>}<Action/></article> }
const options = [
 ['a','Grouped overview','A clear snapshot','A quiet financial panel separates the account summary from individual invoices.'],
 ['b','Open ledger','Easier invoice scanning','An open summary, longer progress bar, and explicit payment statuses keep the details easy to compare.'],
 ['c','Balance first','Focus on outstanding amounts','Due and uninvoiced amounts lead; the estimate total and payment history remain visible for context.'],
]
export default function CardOptions() { return <main className="card-options"><header className="co-page-header"><div><p>CARD EXPLORATIONS</p><h1>One estimate. Three ways to read it.</h1></div><span>Desktop · 1440 px</span></header><div className="co-options">{options.map(([variant,title,benefit,description])=><section key={variant}><div className="co-option-heading"><span>{variant.toUpperCase()}</span><h2>{title}</h2></div><Card variant={variant}/><div className="co-note"><h3>{benefit}</h3><p>{description}</p></div></section>)}</div></main> }

export { Header, Ledger, Action, Progress, Metric }
