import { describe, expect, test } from 'bun:test'
import app from '../src/app'

describe('public review fixes', () => {
  test('Scalar page carries the API title', async () => {
    const docs = await app.request('/docs')
    expect(docs.status).toBe(200)
    expect(await docs.text()).toContain('<title>Initial D Fan API</title>')
  })

  test('OpenAPI document uses a resource-specific id example and links the repository', async () => {
    const document = await (await app.request('/openapi.json')).json()
    const example = (path: string) => document.paths[path].get.parameters[0].schema.example
    expect(example('/api/v1/characters/{id}')).toBe('takumi-fujiwara')
    expect(example('/api/v1/vehicles/{id}')).toBe('toyota-ae86-trueno')
    expect(example('/api/v1/passes/{id}')).toBe('akina')
    expect(example('/api/v1/battles/{id}')).toBe('takumi-vs-keisuke-akina')
    expect(document.externalDocs.url).toBe('https://github.com/saitojo1106/initial-d-fan-api')
    expect(document.info.description).not.toMatch(/\b(seven|[0-9]+) selected\b/)
    expect(document.paths['/api/v1/passes'].get.summary).toBe('List pass names used in the story')
    expect(document.paths['/api/v1/passes'].get.responses['200'].description).toBe('Pass names as used in the story, without geographic coordinates')
  })

  test('Kenta battle cites only the articles about that battle', async () => {
    const battle = (await (await app.request('/api/v1/battles/takumi-vs-kenta-myogi')).json()).data
    expect(battle.sourceIds).not.toContain('yanmaga-battle-04')
    const sources = (await (await app.request('/api/v1/sources')).json()).data
    expect(sources.map((source: { id: string }) => source.id)).toContain('yanmaga-battle-04')
  })
})
