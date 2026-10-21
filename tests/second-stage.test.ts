import { describe, expect, test } from 'bun:test'
import app from '../src/app'
import { catalog, validateCatalog } from '../src/catalog'

const battleIds = [
  'nakazato-vs-seiji-myogi',
  'takumi-vs-seiji-akina',
  'takumi-vs-kyoichi-akagi',
  'ryosuke-vs-kyoichi-akagi',
  'takumi-vs-wataru-shomaru',
]

describe('Second Stage catalog', () => {
  test('adds the five documented battles without replacing First Stage', async () => {
    const all = await (await app.request('/api/v1/battles')).json()
    expect(all.count).toBe(12)
    const second = await (await app.request('/api/v1/battles?stage=second-stage')).json()
    expect(second.count).toBe(5)
    expect(Object.fromEntries(second.data.map((battle: { id: string; winnerCharacterId: string }) => [battle.id, battle.winnerCharacterId]))).toEqual({
      'nakazato-vs-seiji-myogi': 'seiji-iwaki',
      'takumi-vs-seiji-akina': 'takumi-fujiwara',
      'takumi-vs-kyoichi-akagi': 'kyoichi-sudo',
      'ryosuke-vs-kyoichi-akagi': 'ryosuke-takahashi',
      'takumi-vs-wataru-shomaru': 'takumi-fujiwara',
    })
    expect(second.data.map((battle: { id: string }) => battle.id)).toEqual(battleIds)
    expect(second.data.every((battle: { stage: string }) => battle.stage === 'second-stage')).toBe(true)
    for (const id of battleIds) {
      const detail = await app.request(`/api/v1/battles/${id}`)
      expect(detail.status).toBe(200)
      expect((await detail.json()).data).toEqual(second.data.find((battle: { id: string }) => battle.id === id))
    }
  })

  test('combines Stage with character and pass filters and handles empty results', async () => {
    const response = await app.request('/api/v1/battles?stage=second-stage&characterId=takumi-fujiwara&passId=akagi')
    const { data, count } = await response.json()
    expect(count).toBe(1)
    expect(data[0]).toMatchObject({
      id: 'takumi-vs-kyoichi-akagi',
      winnerCharacterId: 'kyoichi-sudo',
    })
    const empty = await app.request('/api/v1/battles?stage=first-stage&passId=shomaru')
    expect(await empty.json()).toEqual({ data: [], count: 0 })
    expect((await app.request('/api/v1/battles?stage=third-stage')).status).toBe(400)
    expect((await app.request('/api/v1/battles?stage=')).status).toBe(400)
  })

  test('counts cross-Stage wins and losses including the engine failure', async () => {
    const records = {
      'takumi-fujiwara': { wins: 8, losses: 1, total: 9 },
      'seiji-iwaki': { wins: 1, losses: 1, total: 2 },
      'kyoichi-sudo': { wins: 1, losses: 1, total: 2 },
      'wataru-akiyama': { wins: 0, losses: 1, total: 1 },
      'ryosuke-takahashi': { wins: 1, losses: 1, total: 2 },
    }
    for (const [id, record] of Object.entries(records)) {
      const response = await app.request(`/api/v1/characters/${id}`)
      expect(response.status).toBe(200)
      expect((await response.json()).data.record).toEqual(record)
    }
  })

  test('serves the new vehicle and pass resources with resolved references', async () => {
    for (const path of [
      'vehicles/mitsubishi-lancer-evolution-iii',
      'vehicles/mitsubishi-lancer-evolution-iv',
      'vehicles/toyota-ae86-levin',
      'passes/akagi',
      'passes/shomaru',
    ]) expect((await app.request(`/api/v1/${path}`)).status).toBe(200)
    expect(validateCatalog(catalog)).toEqual(catalog)
    const invalid = structuredClone(catalog)
    invalid.battles[0]!.stage = 'third-stage' as 'first-stage'
    expect(() => validateCatalog(invalid)).toThrow()
  })

  test('publishes the Stage enum and query in OpenAPI with the release version', async () => {
    const doc = await (await app.request('/openapi.json')).json()
    expect(doc.info.version).toBe('0.2.0')
    const stage = doc.paths['/api/v1/battles'].get.parameters.find((param: { name: string }) => param.name === 'stage')
    expect(stage.required).toBe(false)
    expect(doc.components.schemas.Stage.enum).toEqual(['first-stage', 'second-stage'])
    expect(doc.components.schemas.Battle.required).toContain('stage')
  })
})
