import { SECTIONS } from '../../data/estimates.js'

// Mix stages from the first row, retaining the existing order within each stage.
const stages = ['sent', 'draft', 'accepted']
const queues = stages.map((stage) => SECTIONS.find((section) => section.id === stage).rows)
const rowCount = Math.max(...queues.map((rows) => rows.length))

export const orderedEstimates = Array.from({ length: rowCount }, (_, index) =>
  queues.flatMap((rows) => (rows[index] ? [rows[index]] : [])),
).flat()

export const decisionCount = orderedEstimates.filter((estimate) => estimate.signal.flag).length
