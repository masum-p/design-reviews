import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  Clock01Icon,
  Megaphone01Icon,
} from '@hugeicons/core-free-icons'

import { AvatarStack } from './Avatar'
import Button from './Button'
import ProgressChart from './ProgressChart'
import PanelCard from './PanelCard'
import KeyResultRow from './KeyResultRow'
import InitiativeRow from './InitiativeRow'
import {
  AddInitiativeDialog,
  EditObjectiveDialog,
  KeyResultDialog,
  NewProgressDialog,
} from './dialogs'
import {
  EXPECTED,
  INITIAL_ACTUAL,
  INITIAL_INITIATIVES,
  INITIAL_KEY_RESULTS,
  OBJECTIVE,
  TEAM,
} from '../data'

const STATUS_STYLES = {
  'On Track': 'bg-accent-400/10 text-accent-300 border-accent-400/25',
  'At Risk': 'bg-[#F0CE92]/10 text-[#F0CE92] border-[#F0CE92]/25',
  'Off Track': 'bg-[#F2AFBE]/10 text-[#F2AFBE] border-[#F2AFBE]/25',
}

function MetaChip({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-ink-700 bg-ink-850 px-2.5 py-1 text-xs text-muted">
      <HugeiconsIcon icon={icon} size={14} strokeWidth={1.8} className="shrink-0 text-faint" />
      {children}
    </span>
  )
}

export default function Objectives({ className = '' }) {
  const [objective, setObjective] = useState(OBJECTIVE)
  const [actual, setActual] = useState(INITIAL_ACTUAL)
  const [keyResults, setKeyResults] = useState(INITIAL_KEY_RESULTS)
  const [initiatives, setInitiatives] = useState(INITIAL_INITIATIVES)
  const [selectedDay, setSelectedDay] = useState(INITIAL_ACTUAL.length - 1)
  const [dialog, setDialog] = useState(null)

  const closeDialog = () => setDialog(null)

  function saveProgress({ value, replaceLast }) {
    const next = replaceLast ? [...actual.slice(0, -1), value] : [...actual, value]
    setActual(next)
    setSelectedDay(next.length - 1)
    setObjective((current) => ({ ...current, progress: value, updatedLabel: 'just now' }))
    closeDialog()
  }

  function saveKeyResult(draft) {
    setKeyResults((current) =>
      draft.id
        ? current.map((item) => (item.id === draft.id ? draft : item))
        : [...current, { ...draft, id: `kr-${Date.now()}` }],
    )
    closeDialog()
  }

  function deleteKeyResult(id) {
    setKeyResults((current) => current.filter((item) => item.id !== id))
    closeDialog()
  }

  function addInitiative(draft) {
    setInitiatives((current) => [...current, { ...draft, id: `in-${Date.now()}`, done: false }])
    closeDialog()
  }

  function toggleInitiative(id) {
    setInitiatives((current) =>
      current.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    )
  }

  return (
    <div id="objectives-capture"
      className={`w-[660px] min-w-[660px] shrink-0 overflow-hidden rounded-lg border border-ink-700 bg-ink-900 ${className}`}
    >
      <header className="flex items-center gap-2 border-b border-ink-800 px-4 py-3">
        <button
          type="button"
          disabled
          aria-label="Back to the objectives list, not available in this component"
          title="The objectives list is outside this component"
          className="grid h-7 w-7 place-items-center rounded-md text-faint disabled:cursor-not-allowed"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={2} />
        </button>
        <h2 className="text-[15px] font-medium tracking-tight text-[#EDEDED]">Objectives</h2>
      </header>

      <div className="px-[18px] pb-10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <AvatarStack people={TEAM} />
            <MetaChip icon={Clock01Icon}>{objective.updatedLabel}</MetaChip>
            <MetaChip icon={Megaphone01Icon}>{objective.team}</MetaChip>
            <MetaChip icon={Calendar03Icon}>{objective.cycle}</MetaChip>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setDialog({ type: 'edit' })}
            >
              Edit
            </Button>
            <Button
              variant="primary"
              onClick={() => setDialog({ type: 'progress' })}
            >
              New Progress
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <span
            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
              STATUS_STYLES[objective.status]
            }`}
          >
            {objective.status}
          </span>
        </div>

        <h3 className="mt-3 text-[14px] font-medium leading-[1.3] tracking-tight text-[#EDEDED]">
          {objective.title}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.6] text-muted">{objective.description}</p>

        <div className="mt-5">
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-ink-800"
            role="progressbar"
            aria-valuenow={objective.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Objective progress"
          >
            <div
              className="h-full rounded-full bg-accent-500 transition-[width] duration-500 ease-out"
              style={{ width: `${objective.progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            <span className="font-medium tabular-nums text-[#D4D4D4]">{objective.progress}%</span>{' '}
            Progress
          </p>
        </div>

        <div className="mt-8">
          <ProgressChart
            actual={actual}
            expected={EXPECTED}
            selectedIndex={selectedDay}
            onSelect={setSelectedDay}
          />
        </div>

        <div
          className="mt-7 grid grid-cols-2 items-stretch gap-3"
        >
          <PanelCard
            title="Key Results"
            count={keyResults.length}
            addLabel="Add Key Result"
            onAdd={() => setDialog({ type: 'keyResult', keyResult: null })}
          >
            {keyResults.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-faint">
                No key results yet. Add the first measure of success.
              </p>
            ) : (
              keyResults.map((keyResult) => (
                <KeyResultRow
                  key={keyResult.id}
                  keyResult={keyResult}
                  onEdit={(item) => setDialog({ type: 'keyResult', keyResult: item })}
                />
              ))
            )}
          </PanelCard>

          <PanelCard
            title="Initiatives"
            count={`${initiatives.filter((item) => item.done).length}/${initiatives.length}`}
            addLabel="Add Initiative"
            onAdd={() => setDialog({ type: 'initiative' })}
          >
            {initiatives.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-faint">
                No initiatives yet. Add the work that moves this objective.
              </p>
            ) : (
              initiatives.map((initiative) => (
                <InitiativeRow
                  key={initiative.id}
                  initiative={initiative}
                  onToggle={toggleInitiative}
                />
              ))
            )}
          </PanelCard>
        </div>
      </div>

      {dialog?.type === 'edit' ? (
        <EditObjectiveDialog
          objective={objective}
          onClose={closeDialog}
          onSave={(draft) => {
            setObjective((current) => ({ ...current, ...draft }))
            closeDialog()
          }}
        />
      ) : null}

      {dialog?.type === 'progress' ? (
        <NewProgressDialog actual={actual} onClose={closeDialog} onSave={saveProgress} />
      ) : null}

      {dialog?.type === 'keyResult' ? (
        <KeyResultDialog
          keyResult={dialog.keyResult}
          onClose={closeDialog}
          onSave={saveKeyResult}
          onDelete={deleteKeyResult}
        />
      ) : null}

      {dialog?.type === 'initiative' ? (
        <AddInitiativeDialog onClose={closeDialog} onSave={addInitiative} />
      ) : null}
    </div>
  )
}
