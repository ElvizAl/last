import { z } from 'zod'
import type { UIMessagePart } from '@anvia/client'
import { Check, CircleAlert, LoaderCircle } from 'lucide-react'

const toolLabels: Record<string, string> = {
  get_cat_profile: 'Membaca profil kucing',
  cari_penyakit: 'Mencari referensi kesehatan',
  ask_followup: 'Melengkapi informasi',
  assess_urgency: 'Memeriksa tanda bahaya',
  grade_evidence: 'Memeriksa kutipan sumber',
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

        const followup =
          done && tool.toolName === 'ask_followup'
            ? z
                .object({ questions: z.array(z.string()).min(1).max(2) })
                .safeParse(tool.output)
            : null
        const urgency =
          done && tool.toolName === 'assess_urgency'
            ? z
                .object({
                  status: z.string(),
                  recommendation: z.string(),
                  source: z.url(),
                })
                .safeParse(tool.output)
            : null

        return (
          <div key={tool.id} className="flex flex-col items-start gap-2">
            <div
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
            {followup?.success && (
              <div className="max-w-xl rounded-2xl border border-[#dce1d4] bg-[#f7f9f2] px-4 py-3 text-sm leading-7 text-[#46523f]">
                <p className="mb-2 text-xs font-medium text-[#718567]">
                  Bantu ceritakan sedikit lagi
                </p>
                {followup.data.questions.map((question, index) => (
                  <p key={index}>{question}</p>
                ))}
                <p className="mt-2 text-[11px] text-[#89917f]">
                  Jawab lewat kolom pesan di bawah.
                </p>
              </div>
            )}
            {urgency?.success &&
              urgency.data.status === 'emergency_sign_reported' && (
                <div
                  role="alert"
                  className="max-w-xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900"
                >
                  <p>{urgency.data.recommendation}</p>
                  <a
                    href={urgency.data.source}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs underline"
                  >
                    Referensi kondisi darurat: Cornell
                  </a>
                </div>
              )}
          </div>
        )
      })}
    </div>
  )
}
