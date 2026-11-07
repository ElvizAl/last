import type { UIMessagePart } from '@anvia/client'
import { Check, CircleAlert, LoaderCircle } from 'lucide-react'

const toolLabels: Record<string, string> = {
  cari_penyakit: 'Mencari referensi kesehatan',
}

export function ToolActivity({
  parts,
}: {
  parts: ReadonlyArray<UIMessagePart>
}) {
  const tools = parts.filter((part) => part.type === 'tool')
  if (tools.length === 0) return null

  return (
    <div aria-label="Aktivitas AnabulCare" className="mb-4 flex flex-col gap-2">
      {tools.map((tool) => {
        const done = tool.state === 'output-available'
        const failed = tool.state === 'error'
        const label =
          toolLabels[tool.toolName] ?? tool.toolName.replaceAll('_', ' ')

        return (
          <div
            key={tool.id}
            role="status"
            className="flex w-fit items-center gap-2 rounded-xl border border-[#dce1d4] bg-[#f4f6ef] px-3 py-2 text-xs text-[#52684a]"
          >
            {failed ? (
              <CircleAlert size={14} className="shrink-0 text-red-700" />
            ) : done ? (
              <Check size={14} className="shrink-0" />
            ) : (
              <LoaderCircle size={14} className="shrink-0 animate-spin" />
            )}
            <span>{label}</span>
            <span className="text-[#737a70]">
              {failed ? 'Gagal' : done ? 'Selesai' : 'Berjalan…'}
            </span>
          </div>
        )
      })}
    </div>
  )
}
