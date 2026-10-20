import { describe, expect, test } from 'bun:test'
import app from '../src/app'

describe('read-only catalog API', () => {
  test('finds characters and reports only seeded battle results', async () => {
    const list = await app.request('/api/v1/characters?q=藤原')
    expect(list.status).toBe(200)
    expect((await list.json()).data.map((item: { id: string }) => item.id)).toEqual(['takumi-fujiwara'])

    const detail = await app.request('/api/v1/characters/takumi-fujiwara')
    expect(detail.status).toBe(200)
    const character = (await detail.json()).data
    expect(character.vehicleIds).toEqual(['toyota-ae86-trueno'])
    expect(character.record).toEqual({ wins: 6, losses: 0, total: 6 })
  })

  test('includes the verified First Stage driver battles and their results', async () => {
    const response = await app.request('/api/v1/battles')
    expect(response.status).toBe(200)
    const { data, count } = await response.json()
    expect(count).toBe(7)
    expect(Object.fromEntries(data.map((battle: { id: string; winnerCharacterId: string }) => [battle.id, battle.winnerCharacterId]))).toEqual({
      'takumi-vs-keisuke-akina': 'takumi-fujiwara',
      'takumi-vs-nakazato-akina': 'takumi-fujiwara',
      'takumi-vs-shingo-akina': 'takumi-fujiwara',
      'takumi-vs-mako-usui': 'takumi-fujiwara',
      'keisuke-vs-nakazato-myogi': 'keisuke-takahashi',
      'takumi-vs-kenta-myogi': 'takumi-fujiwara',
      'takumi-vs-ryosuke-akina': 'takumi-fujiwara',
    })
    const keisuke = await app.request('/api/v1/characters/keisuke-takahashi')
    expect((await keisuke.json()).data.record).toEqual({ wins: 1, losses: 1, total: 2 })
    const nakazato = await app.request('/api/v1/characters/takeshi-nakazato')
    expect((await nakazato.json()).data.record).toEqual({ wins: 0, losses: 2, total: 2 })
    const sileighty = await app.request('/api/v1/vehicles/nissan-sileighty')
    expect((await sileighty.json()).data.specifications).toEqual({})
  })

  test('connects each battle to known people, vehicles, passes and a winner', async () => {
    const response = await app.request('/api/v1/battles?characterId=keisuke-takahashi&passId=akina')
    expect(response.status).toBe(200)
    const { data } = await response.json()
    expect(data).toHaveLength(1)
    expect(data[0]).toMatchObject({
      id: 'takumi-vs-keisuke-akina',
      passId: 'akina',
      winnerCharacterId: 'takumi-fujiwara',
      participants: [
        { characterId: 'takumi-fujiwara', vehicleId: 'toyota-ae86-trueno' },
        { characterId: 'keisuke-takahashi', vehicleId: 'mazda-fd3s-rx7' },
      ],
    })
    expect(data[0].sourceIds.length).toBeGreaterThan(0)
  })

  test('returns documented resources and explicit missing-resource errors', async () => {
    for (const path of ['vehicles', 'passes', 'battles', 'sources']) {
      const response = await app.request(`/api/v1/${path}`)
      expect(response.status).toBe(200)
      expect((await response.json()).data.length).toBeGreaterThan(0)
    }
    const vehicle = await app.request('/api/v1/vehicles/toyota-ae86-trueno')
    expect((await vehicle.json()).data.specifications.chassisCode).toBe('AE86')
    const absent = await app.request('/api/v1/passes/unknown')
    expect(absent.status).toBe(404)
    expect((await absent.json()).error.code).toBe('NOT_FOUND')
  })

  test('serves a matching OpenAPI document and Scalar page', async () => {
    const response = await app.request('/openapi.json')
    expect(response.status).toBe(200)
    const document = await response.json()
    expect(document.openapi).toStartWith('3.')
    for (const path of ['/api/v1/characters', '/api/v1/characters/{id}', '/api/v1/vehicles', '/api/v1/vehicles/{id}', '/api/v1/passes', '/api/v1/passes/{id}', '/api/v1/battles', '/api/v1/battles/{id}', '/api/v1/sources']) {
      expect(document.paths[path]?.get).toBeDefined()
    }
    const docs = await app.request('/docs')
    expect(docs.status).toBe(200)
    expect(await docs.text()).toContain('/openapi.json')
  })
})
