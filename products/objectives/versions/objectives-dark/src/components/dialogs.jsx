import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import Dialog from './Dialog'
import Button from './Button'
import { RangeInput, Select, TextArea, TextInput } from './Field'
import { CHART_DAYS, PEOPLE, STATUSES } from '../data'

const OWNER_OPTIONS = Object.values(PEOPLE)

export function EditObjectiveDialog({ objective, onSave, onClose }) {
  const [draft, setDraft] = useState({
    title: objective.title,
    description: objective.description,
    status: objective.status,
    team: objective.team,
    cycle: objective.cycle,
  })

  const valid = draft.title.trim().length > 0

  return (
    <Dialog
      title="Edit objective"
      description="Changes apply to this component only."
      onClose={onClose}
      onSubmit={() => valid && onSave(draft)}
      footer={
        <>
          <Button onClick={onClose} variant="ghost" size="md">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" disabled={!valid}>
            Save changes
          </Button>
        </>
      }
    >
      <TextArea
        label="Objective"
        rows={3}
        value={draft.title}
        onChange={(event) => setDraft({ ...draft, title: event.target.value })}
      />
      <TextArea
        label="Description"
        rows={4}
        value={draft.description}
        onChange={(event) => setDraft({ ...draft, description: event.target.value })}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Status"
          value={draft.status}
          onChange={(event) => setDraft({ ...draft, status: event.target.value })}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <TextInput
          label="Team"
          value={draft.team}
          onChange={(event) => setDraft({ ...draft, team: event.target.value })}
        />
        <TextInput
          label="Cycle"
          value={draft.cycle}
          onChange={(event) => setDraft({ ...draft, cycle: event.target.value })}
        />
      </div>
    </Dialog>
  )
}

export function NewProgressDialog({ actual, onSave, onClose }) {
  const nextIndex = actual.length
  const atEnd = nextIndex >= CHART_DAYS.length
  const [value, setValue] = useState(actual[actual.length - 1] ?? 0)
  const [note, setNote] = useState('')

  return (
    <Dialog
      title="New progress"
      description={
        atEnd
          ? `The Dec 1 to Dec 6 window is full. Update the last check in on ${CHART_DAYS[nextIndex - 1]} instead.`
          : `Logs a check in for ${CHART_DAYS[nextIndex]} and updates the objective score.`
      }
      onClose={onClose}
      onSubmit={() => onSave({ value, note, replaceLast: atEnd })}
      footer={
        <>
          <Button onClick={onClose} variant="ghost" size="md">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            {atEnd ? 'Update check in' : 'Log progress'}
          </Button>
        </>
      }
    >
      <RangeInput label="Score out of 100" value={value} onChange={setValue} />
      <TextInput
        label="Exact value"
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value)
          setValue(Number.isNaN(next) ? 0 : Math.max(0, Math.min(100, next)))
        }}
      />
      <TextArea
        label="What moved"
        rows={3}
        placeholder="Pricing page rewrite shipped, CTR up 0.3 points week over week."
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
    </Dialog>
  )
}

const BLANK_KEY_RESULT = {
  title: '',
  owner: 'priya',
  unit: '',
  start: 0,
  current: 0,
  goal: 100,
  due: '2026-12-31',
}

export function KeyResultDialog({ keyResult, onSave, onDelete, onClose }) {
  const editing = Boolean(keyResult)
  const [draft, setDraft] = useState(keyResult ?? BLANK_KEY_RESULT)

  const valid = draft.title.trim().length > 0 && draft.start !== draft.goal
  const set = (patch) => setDraft({ ...draft, ...patch })
  const num = (event) => {
    const next = Number(event.target.value)
    return Number.isNaN(next) ? 0 : next
  }

  return (
    <Dialog
      title={editing ? 'Update key result' : 'Add key result'}
      description={
        draft.start === draft.goal && draft.title.trim()
          ? 'Start and goal must be different so progress can be measured.'
          : 'Progress is measured from start to goal, in either direction.'
      }
      onClose={onClose}
      onSubmit={() => valid && onSave(draft)}
      footer={
        <>
          {editing ? (
            <Button
              variant="danger"
              size="md"
              onClick={() => onDelete(keyResult.id)}
              className="mr-auto px-3"
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} />
              Remove
            </Button>
          ) : null}
          <Button onClick={onClose} variant="ghost" size="md">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" disabled={!valid}>
            {editing ? 'Save key result' : 'Add key result'}
          </Button>
        </>
      }
    >
      <TextArea
        label="Key result"
        rows={2}
        placeholder="Cut paid acquisition cost to $23 per signup"
        value={draft.title}
        onChange={(event) => set({ title: event.target.value })}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextInput
          label="Start"
          type="number"
          step="any"
          value={draft.start}
          onChange={(event) => set({ start: num(event) })}
        />
        <TextInput
          label="Current"
          type="number"
          step="any"
          value={draft.current}
          onChange={(event) => set({ current: num(event) })}
        />
        <TextInput
          label="Goal"
          type="number"
          step="any"
          value={draft.goal}
          onChange={(event) => set({ goal: num(event) })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Unit" value={draft.unit} onChange={(event) => set({ unit: event.target.value })}>
          <option value="">Number</option>
          <option value="$">Dollars</option>
          <option value="%">Percent</option>
        </Select>
        <Select label="Owner" value={draft.owner} onChange={(event) => set({ owner: event.target.value })}>
          {OWNER_OPTIONS.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </Select>
        <TextInput
          label="Due"
          type="date"
          value={draft.due}
          onChange={(event) => set({ due: event.target.value })}
        />
      </div>
    </Dialog>
  )
}

export function AddInitiativeDialog({ onSave, onClose }) {
  const [draft, setDraft] = useState({ title: '', owner: 'priya', due: '2026-12-31' })
  const valid = draft.title.trim().length > 0

  return (
    <Dialog
      title="Add initiative"
      description="Work that moves the key results forward."
      onClose={onClose}
      onSubmit={() => valid && onSave(draft)}
      footer={
        <>
          <Button onClick={onClose} variant="ghost" size="md">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" disabled={!valid}>
            Add initiative
          </Button>
        </>
      }
    >
      <TextArea
        label="Initiative"
        rows={2}
        placeholder="Rewrite the pricing page and ship an A/B test"
        value={draft.title}
        onChange={(event) => setDraft({ ...draft, title: event.target.value })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Owner"
          value={draft.owner}
          onChange={(event) => setDraft({ ...draft, owner: event.target.value })}
        >
          {OWNER_OPTIONS.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </Select>
        <TextInput
          label="Due"
          type="date"
          value={draft.due}
          onChange={(event) => setDraft({ ...draft, due: event.target.value })}
        />
      </div>
    </Dialog>
  )
}
