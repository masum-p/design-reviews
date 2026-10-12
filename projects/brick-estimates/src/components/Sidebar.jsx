import {
  Search01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Album02Icon,
  Briefcase02Icon,
  Building03Icon,
  Calendar03Icon,
  ChartLineData01Icon,
  CheckListIcon,
  Clock01Icon,
  FileEditIcon,
  Home01Icon,
  Invoice01Icon,
  MapsIcon,
  PipelineIcon,
  UserGroupIcon,
} from '@hugeicons-pro/core-stroke-rounded'
import Icon from '../ui/Icon'

const NAV_GROUPS = [
  {
    label: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home01Icon },
      { id: 'time', label: 'Time tracking', icon: Clock01Icon },
      { id: 'tasks', label: 'Task list', icon: CheckListIcon },
    ],
  },
  {
    label: 'Money',
    items: [
      { id: 'leads', label: 'Lead pipeline', icon: PipelineIcon },
      { id: 'estimates', label: 'Estimates', icon: FileEditIcon, current: true },
      { id: 'invoices', label: 'Invoices', icon: Invoice01Icon },
      { id: 'projects', label: 'Projects', icon: Briefcase02Icon },
    ],
  },
  {
    label: 'Field',
    items: [
      { id: 'schedule', label: 'Schedule', icon: Calendar03Icon },
      { id: 'photos', label: 'Photos and files', icon: Album02Icon },
      { id: 'people', label: 'People', icon: UserGroupIcon },
      { id: 'map', label: 'Map', icon: MapsIcon },
      { id: 'reports', label: 'Reports', icon: ChartLineData01Icon },
    ],
  },
]

export default function Sidebar({ estimateCount, reference = false }) {
  return (
    <aside className="fixed inset-y-0 left-0 flex w-[240px] flex-col border-r border-line bg-white">
      <div className="flex items-center gap-3 px-6 pt-7 pb-8">
        <span className="flex size-9 items-center justify-center rounded-lg bg-ink text-white">
          <Icon icon={Building03Icon} size={20} />
        </span>
        <span className="leading-tight">
          <span className="block text-[15px] font-bold tracking-tight text-ink">BRICK</span>
          <span className="block text-[11px] font-semibold tracking-[0.16em] text-slate-500">
            CONSTRUCTION
          </span>
        </span>
      </div>

      <nav aria-label="Workspace" className="flex-1 px-3">
        {reference && <div className="flex items-center gap-3 px-3 pb-5 text-sm text-slate-600"><Icon icon={Search01Icon} size={18}/>Search</div>}
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-7 last:mb-0">
            <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase">
              {group.label}
            </p>
            <ul>
              {group.items.map((item) => (
                <li
                  key={item.id}
                  aria-current={item.current ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                    item.current
                      ? 'bg-brand-soft font-semibold text-brand-ink'
                      : 'font-medium text-slate-600'
                  }`}
                >
                  <Icon
                    icon={item.icon}
                    size={18}
                    className={item.current ? '' : 'text-slate-500'}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.current ? (
                    <span className="text-xs font-semibold tabular-nums">{estimateCount}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-line px-6 py-5">
        <span className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-[13px] font-semibold text-slate-700">
          SA
        </span>
        <span className="leading-tight">
          <span className="block text-[13px] font-semibold text-ink">Safayet Ahmad</span>
          {!reference && <span className="block text-xs text-slate-500">Workspace admin</span>}
        </span>
        {reference && <Icon icon={ArrowRight01Icon} size={16}/>}
      </div>
      {reference && <div className="flex items-center justify-between px-6 pb-5 text-xs text-slate-500"><div><strong className="block font-medium text-slate-700">8:25 AM</strong>Feb 27, 2024</div><Icon icon={CheckmarkCircle01Icon} size={20}/></div>}
    </aside>
  )
}
