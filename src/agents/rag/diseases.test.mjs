import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { buildDiseaseDocuments, RAG_SOURCE } from './diseases.ts'

test('real source produces 50 complete entries with correct page ownership', async () => {
  const input = JSON.parse(
    await readFile(
      new URL('../../../documents/penyakit-pages.json', import.meta.url),
      'utf8',
    ),
  )
  const docs = buildDiseaseDocuments(input)
  assert.equal(input.length, 56)
  assert.equal(docs.length, 50)
  assert.equal(new Set(docs.map((doc) => doc.id)).size, 50)
  assert.ok(docs.every((doc) => doc.metadata.source === RAG_SOURCE))
  assert.equal(docs[1].metadata.page, 2)
  assert.equal(docs[1].metadata.pages, '2, 3')
  assert.equal(docs[1].metadata.documentId, docs[1].id)
  assert.equal(docs[1].metadata.sourceFile, 'penyakit-pages.json')
  assert.equal(docs[1].metadata.pageStart, 2)
  assert.equal(docs[1].metadata.pageEnd, 3)
  assert.equal(docs[1].metadata.pageCount, 2)
  assert.ok(docs[1].metadata.referenceCount > 0)
  assert.ok(
    docs[1].metadata.referenceUrls.includes('https://www.vet.cornell.edu/'),
  )
  assert.equal(
    docs[1].metadata.referenceCount,
    docs[1].metadata.referenceUrls.split('\n').length,
  )
  assert.ok(docs.every((doc) => doc.metadata.documentId === doc.id))
  assert.match(docs[1].text, /L-lisin/)
  assert.doesNotMatch(docs[1].text, /Entri 03/)
  assert.equal(docs[29].metadata.pages, '32')
  assert.equal(docs[30].metadata.pages, '32, 33')
  assert.equal(
    docs[41].metadata.diseaseName,
    'Disfungsi kognitif (Feline cognitive dysfunction syndrome)',
  )
  assert.equal(docs[49].metadata.pages, '54, 55, 56')
  assert.match(docs[49].text, /msdvetmanual/)
})

test('rejects duplicate pages, missing pages, and duplicate entries', () => {
  const first = { page: 1, text: '**Entri 01 - A**\nIsi penyakit pertama' }
  assert.throws(
    () => buildDiseaseDocuments([first, first]),
    /halaman harus unik/,
  )
  assert.throws(
    () => buildDiseaseDocuments([first, { page: 3, text: 'Lanjutan' }]),
    /tidak berurutan/,
  )
  assert.throws(
    () => buildDiseaseDocuments([first, { page: 2, text: '**Entri 01 - B**' }]),
    /lebih dari sekali/,
  )
})

test('splits two entries on the same page without sharing their text', () => {
  const docs = buildDiseaseDocuments([
    {
      page: 1,
      text: 'Pengantar\n**Entri 01 - A**\nTeks pertama\n# **Entri 02 - B**\nTeks kedua',
    },
    { page: 2, text: 'Lanjutan kedua' },
  ])
  assert.equal(docs.length, 2)
  assert.doesNotMatch(docs[0].text, /Teks kedua/)
  assert.match(docs[1].text, /Lanjutan kedua/)
  assert.equal(docs[1].metadata.pages, '1, 2')
})

test('reference URLs are deduplicated and empty references remain explicit', () => {
  const docs = buildDiseaseDocuments([
    {
      page: 1,
      text: '**Entri 01 - A**\nSumber: (https://example.test/one); https://example.test/one.\n**Entri 02 - B**\nTanpa tautan.',
    },
  ])
  assert.equal(docs[0].metadata.referenceUrls, 'https://example.test/one')
  assert.equal(docs[0].metadata.referenceCount, 1)
  assert.equal(docs[1].metadata.referenceUrls, '')
  assert.equal(docs[1].metadata.referenceCount, 0)
})
