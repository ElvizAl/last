import { createTool } from '@anvia/core'
import { z } from 'zod'
import type { TextDocument } from '@anvia/core/documents'
import type { VectorSearchResult } from '@anvia/core/vector-store'

export type RetrievedEvidence = VectorSearchResult<TextDocument>
export type EvidenceRegistry = Map<string, RetrievedEvidence>

export function createGradeEvidenceTool(evidence: EvidenceRegistry) {
  return createTool({
    name: 'grade_evidence',
    description:
      'Verifikasi documentId, sumber, halaman metadata, dan kutipan persis dari hasil cari_penyakit pada request ini. Panggil setelah pencarian selesai. Tidak menilai kebenaran medis, kecocokan diagnosis, atau posisi kutipan pada halaman PDF asli.',
    inputSchema: z.object({
      citations: z
        .array(
          z.object({
            documentId: z.string().trim().min(1),
            source: z.string().trim().min(1),
            page: z.number().int().positive(),
            quote: z.string().trim().min(1).max(2000),
          }),
        )
        .min(1)
        .max(10),
    }),
    execute: ({ citations }) => {
      const results = citations.map((citation) => {
        const record = evidence.get(citation.documentId)
        const metadata = record?.metadata ?? record?.document.metadata
        const pages = String(metadata?.pages ?? metadata?.page ?? '')
          .split(',')
          .map((page) => Number(page.trim()))
        const sourceMatches = metadata?.source === citation.source
        const pageMatches = pages.includes(citation.page)
        const quoteMatches =
          record?.document.text
            .replace(/\s+/g, ' ')
            .includes(citation.quote.replace(/\s+/g, ' ')) ?? false
        return {
          ...citation,
          retrieved: !!record,
          sourceMatches,
          pageMatches,
          quoteMatches,
          verified: !!record && sourceMatches && pageMatches && quoteMatches,
        }
      })
      return {
        allVerified: results.every((result) => result.verified),
        results,
        medicalValidity: 'not_assessed',
        pageVerification: 'metadata_only',
        limitation:
          'Verifikasi keberadaan kutipan dalam record dan halaman pada metadata. Bukan validasi medis, penilaian diagnosis, atau konfirmasi letak kutipan di PDF asli.',
      }
    },
  })
}
