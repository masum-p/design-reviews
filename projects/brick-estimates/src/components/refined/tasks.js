export function taskFor(estimate) {
  const { stage, signal, billing } = estimate
  if (stage === 'draft') return {
    label: 'Continue estimate', title: 'Finish your quote',
    detail: `${signal.primary}. This estimate has not been sent.`, actionable: true,
  }
  if (stage === 'sent' && signal.expiring) return {
    label: 'Follow up', title: signal.flag,
    detail: `${signal.secondary}. Still awaiting a decision.`, actionable: true, urgent: true,
  }
  if (stage === 'sent' && signal.flag) return {
    label: 'Resend estimate', title: 'Client has not opened it',
    detail: `${signal.primary}. Check they received your quote.`, actionable: true,
  }
  if (stage === 'sent') return {
    label: 'View estimate', title: 'Waiting for a reply',
    detail: `${signal.secondary}. No follow-up needed yet.`, actionable: false,
  }
  if (signal.unscheduled) return {
    label: 'Schedule work', title: 'Agree on a start date',
    detail: 'The estimate is accepted. Your crew is not scheduled.', actionable: true,
  }
  if (!billing.fullyBilled) return {
    label: 'Review billing', title: 'Check the payment schedule',
    detail: `${signal.secondary}. Review the agreed deposit before work begins.`, actionable: true,
  }
  return {
    label: 'View invoices', title: 'Estimate fully invoiced',
    detail: 'Manage the remaining payment from the invoices.', actionable: false,
  }
}
