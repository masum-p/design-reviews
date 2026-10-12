/**
 * Trade chips. The original screen showed three scope lines per card with an
 * undecodable emoji on each; a contractor only needs to know which trades a job
 * pulls in, and that fits on one line.
 */
export default function TradeChips({ trades, max = 4 }) {
  const shown = trades.slice(0, max)
  const rest = trades.length - shown.length

  return (
    <span className="mt-2 flex flex-wrap items-center gap-1.5">
      {shown.map((trade) => (
        <span
          key={trade}
          className="rounded border border-line bg-slate-50 px-1.5 py-px text-[11px] font-medium text-slate-500"
        >
          {trade}
        </span>
      ))}
      {rest > 0 ? <span className="text-[11px] font-medium text-slate-500">+{rest}</span> : null}
    </span>
  )
}
