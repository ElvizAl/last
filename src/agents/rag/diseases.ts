import { z } from 'zod'

export const RAG_SOURCE = 'documents/penyakit-pages.json'

const pagesSchema = z
  .array(
    z.object({
      page: z.number().int().positive(),
      text: z.string().trim().min(1),
    }),
  )
  .min(1)

type Disease = {
  number: number
  name: string
  sections: Array<{ page: number; text: string }>
}

// Pecah pada heading Entri, bukan pada batas halaman atau ukuran karakter.
export function buildDiseaseDocuments(input: unknown) {
  const pages = pagesSchema.parse(input).sort((a, b) => a.page - b.page)
  if (new Set(pages.map((page) => page.page)).size !== pages.length) {
    throw new Error('Nomor halaman harus unik.')
  }
  for (let index = 1; index < pages.length; index++) {
    if (pages[index].page !== pages[index - 1].page + 1) {
      throw new Error(
        'Halaman tidak berurutan. Periksa sumber sebelum menyatukan entri.',
      )
    }
  }

  const diseases: Disease[] = []
  let current: Disease | undefined
  for (const page of pages) {
    const headings = [
      ...page.text.matchAll(
        /^(?:#{1,6}\s*)?\*{0,2}Entri\s+(\d+)\s*[\u2014\u2013-]\s*(.+)$/gm,
      ),
    ]
    const continuation = page.text
      .slice(0, headings[0]?.index ?? page.text.length)
      .trim()
    if (current && continuation) {
      current.sections.push({ page: page.page, text: continuation })
      // Heading Entri 42 pada sumber terpotong antara halaman 44 dan 45.
      if (current.name.split('(').length > current.name.split(')').length) {
        const firstLine = continuation
          .split('\n')[0]
          .replace(/^#+\s*/, '')
          .replace(/\*/g, '')
          .trim()
        if (firstLine.endsWith(')')) current.name += ` ${firstLine}`
      }
    }
    for (let index = 0; index < headings.length; index++) {
      const heading = headings[index]
      const number = Number(heading[1])
      if (diseases.some((disease) => disease.number === number)) {
        throw new Error(`Nomor entri ${number} muncul lebih dari sekali.`)
      }
      current = {
        number,
        name: heading[2].replace(/\*+$/, '').trim(),
        sections: [
          {
            page: page.page,
            text: page.text
              .slice(heading.index, headings[index + 1]?.index)
              .trim(),
          },
        ],
      }
      diseases.push(current)
    }
  }
  if (!diseases.length)
    throw new Error('Heading Entri penyakit tidak ditemukan.')
  for (let index = 0; index < diseases.length; index++) {
    if (diseases[index].number !== index + 1)
      throw new Error('Nomor entri penyakit tidak berurutan.')
  }

  return diseases.map((disease) => {
    const sourcePages = [
      ...new Set(disease.sections.map((section) => section.page)),
    ]
    const id = `penyakit-entry-${String(disease.number).padStart(2, '0')}`
    const text = disease.sections.map((section) => section.text).join('\n\n')
    const referenceUrls = [
      ...new Set(
        [...text.matchAll(/https?:\/\/[^\s<>"|]+/g)]
          .map((match) => match[0].replace(/[),;.*]+$/, ''))
          .filter((url) => URL.canParse(url)),
      ),
    ]
    return {
      id,
      text,
      metadata: {
        documentId: id,
        source: RAG_SOURCE,
        sourceFile: 'penyakit-pages.json',
        title: 'Dataset Penyakit Kucing - Versi Ringkas',
        diseaseName: disease.name,
        entry: disease.number,
        page: sourcePages[0],
        pages: sourcePages.join(', '),
        pageStart: sourcePages[0],
        pageEnd: sourcePages[sourcePages.length - 1],
        pageCount: sourcePages.length,
        referenceUrls: referenceUrls.join('\n'),
        referenceCount: referenceUrls.length,
        version: 2,
      },
    }
  })
}
