import { createTool } from '@anvia/core'
import { z } from 'zod'

export const CORNELL_SOURCE =
  'https://www.vet.cornell.edu/hospitals/services/emergency-and-critical-care-0'

// Cornell: Emergency Critical Care Emergent Conditions, diakses 8 November 2026.
// Daftar contoh kondisi darurat; bukan alat diagnosis atau penentu bahwa pasien aman.
export const dangerSigns = {
  unresponsive: 'Tidak sadar atau tidak merespons',
  difficulty_breathing: 'Kesulitan bernapas',
  collapse: 'Kolaps',
  abnormal_gums: 'Gusi biru, ungu, atau pucat',
  trauma: 'Trauma, jatuh, kecelakaan, atau luka',
  excessive_bleeding: 'Perdarahan berlebihan',
  loss_of_balance: 'Kehilangan keseimbangan',
  lethargy_or_weakness: 'Lesu atau lemah',
  difficulty_urinating: 'Kesulitan buang air kecil',
  toxic_ingestion: 'Tidak sengaja menelan obat atau zat beracun',
  seizure_or_tremor: 'Kejang atau tremor aktif',
  non_weight_bearing: 'Pincang tanpa mampu menumpu beban',
  difficulty_walking: 'Kesulitan berjalan',
  hives_or_facial_swelling: 'Biduran atau pembengkakan wajah',
  difficulty_giving_birth: 'Kesulitan melahirkan',
  pain: 'Nyeri',
  severe_or_protracted_vomiting: 'Muntah parah atau berkepanjangan',
  non_productive_retching: 'Mengejan hendak muntah tanpa hasil',
  severe_bloody_diarrhea:
    'Diare parah dengan darah merah atau hitam seperti ter',
  abdominal_distension_or_pain: 'Perut membesar, kembung, atau nyeri',
} as const

const observationsSchema = z
  .array(
    z.object({
      sign: z.enum(Object.keys(dangerSigns) as Array<keyof typeof dangerSigns>),
      status: z.enum(['reported', 'denied', 'unknown']),
      quote: z.string().trim().max(1000),
    }),
  )
  .max(20)
  .superRefine((items, context) => {
    if (new Set(items.map((item) => item.sign)).size !== items.length) {
      context.addIssue({
        code: 'custom',
        message: 'Setiap tanda hanya boleh dinilai sekali.',
      })
    }
  })

export function createAssessUrgencyTool(userMessage: string) {
  return createTool({
    name: 'assess_urgency',
    description: `Periksa checklist contoh kondisi darurat Cornell. Klasifikasi hanya tanda yang benar-benar dilaporkan pada pesan terbaru, sertakan kutipan persis pengguna. Informasi yang tidak disampaikan adalah unknown, bukan denied. Daftar: ${JSON.stringify(dangerSigns)}. Tool tidak memeriksa pasien atau membuktikan bahwa kondisi aman.`,
    inputSchema: z.object({ observations: observationsSchema }),
    execute: ({ observations }) => {
      const checked = observations.map((item) => ({
        ...item,
        label: dangerSigns[item.sign],
        supported:
          item.status !== 'unknown' &&
          item.quote.length > 0 &&
          userMessage.includes(item.quote),
      }))
      const reported = checked.filter(
        (item) => item.status === 'reported' && item.supported,
      )
      const unknown = Object.keys(dangerSigns).filter(
        (sign) => !checked.some((item) => item.sign === sign && item.supported),
      )
      return {
        status: reported.length
          ? 'emergency_sign_reported'
          : unknown.length
            ? 'insufficient_information'
            : 'no_listed_sign_reported',
        reported,
        unknown,
        rejected: checked.filter(
          (item) => item.status !== 'unknown' && !item.supported,
        ),
        recommendation: reported.length
          ? 'Segera cari pertolongan dokter hewan atau klinik darurat terdekat. Jangan menunda untuk melengkapi pertanyaan atau mencari referensi.'
          : 'Checklist ini belum menetapkan bahwa kucing aman. Konsultasikan dengan dokter hewan; tanyakan informasi penting yang belum diketahui.',
        source: CORNELL_SOURCE,
        limitation:
          'Kecocokan kutipan diperiksa secara tekstual. Makna dan klasifikasi tanda berasal dari interpretasi model atas laporan pengguna, bukan pemeriksaan medis. Checklist kosong tidak berarti aman.',
      }
    },
  })
}
