import assert from 'node:assert/strict'
import test from 'node:test'
import { askFollowup } from './ask-followup.ts'
import { createAssessUrgencyTool } from './assess-urgency.ts'
import { createGradeEvidenceTool } from './grade-evidence.ts'

const call = (tool, input) =>
  tool.call(tool.parseInput ? tool.parseInput(input) : input)

test('followup returns questions to render without fabricating user answers', async () => {
  const result = await call(askFollowup, { questions: ['Sejak kapan bersin?'] })
  assert.equal(result.status, 'awaiting_user_reply')
  assert.deepEqual(result.questions, ['Sejak kapan bersin?'])
  assert.throws(() => call(askFollowup, { questions: [] }))
  assert.throws(() => call(askFollowup, { questions: ['a', 'b', 'c'] }))
})
test('urgency flags supported signs and keeps unreported signs unknown', async () => {
  const tool = createAssessUrgencyTool('Dia kesulitan bernapas sejak tadi.')
  const result = await call(tool, {
    observations: [
      {
        sign: 'difficulty_breathing',
        status: 'reported',
        quote: 'kesulitan bernapas',
      },
    ],
  })
  assert.equal(result.status, 'emergency_sign_reported')
  assert.equal(result.reported.length, 1)
  assert.equal(result.unknown.length, 19)
})
test('urgency rejects invented quotations and never equates missing data with safety', async () => {
  const tool = createAssessUrgencyTool('Dia bersin.')
  const result = await call(tool, {
    observations: [{ sign: 'collapse', status: 'reported', quote: 'kolaps' }],
  })
  assert.equal(result.status, 'insufficient_information')
  assert.equal(result.reported.length, 0)
  assert.equal(result.rejected.length, 1)
  assert.equal(result.unknown.length, 20)
  assert.equal(
    (await call(tool, { observations: [] })).status,
    'insufficient_information',
  )
})
test('Cornell includes reported weakness; duplicate signs are invalid', async () => {
  const tool = createAssessUrgencyTool('Kucing saya lemah.')
  const item = {
    sign: 'lethargy_or_weakness',
    status: 'reported',
    quote: 'lemah',
  }
  assert.equal(
    (await call(tool, { observations: [item] })).status,
    'emergency_sign_reported',
  )
  assert.throws(() => call(tool, { observations: [item, item] }))
})
test('evidence verifies only actual retrieved ID, source, page and quote', async () => {
  const records = new Map([
    [
      'disease-1',
      {
        id: 'disease-1',
        score: 0.9,
        document: { id: 'disease-1', text: 'Gejala: bersin dan mata berair.' },
        metadata: { source: 'dataset.json', pages: '1, 2' },
      },
    ],
  ])
  const tool = createGradeEvidenceTool(records)
  const citation = {
    documentId: 'disease-1',
    source: 'dataset.json',
    page: 2,
    quote: 'bersin dan mata berair',
  }
  const result = await call(tool, { citations: [citation] })
  assert.equal(result.allVerified, true)
  assert.equal(result.medicalValidity, 'not_assessed')
  assert.equal(result.pageVerification, 'metadata_only')
  for (const change of [
    { documentId: 'invented' },
    { source: 'invented.pdf' },
    { page: 9 },
    { quote: 'demam tinggi' },
  ]) {
    assert.equal(
      (await call(tool, { citations: [{ ...citation, ...change }] }))
        .allVerified,
      false,
    )
  }
  assert.equal(
    (await call(createGradeEvidenceTool(new Map()), { citations: [citation] }))
      .allVerified,
    false,
  )
})
