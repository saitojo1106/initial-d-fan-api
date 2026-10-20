import { expect, test } from 'bun:test'
import worker from '../src/worker'

test('Cloudflare Worker entry serves the API and OpenAPI specification', async () => {
  const character = await worker.fetch(new Request('https://example.workers.dev/api/v1/characters/takumi-fujiwara'))
  expect(character.status).toBe(200)
  expect((await character.json()).data.name).toBe('藤原拓海')

  const specification = await worker.fetch(new Request('https://example.workers.dev/openapi.json'))
  expect(specification.status).toBe(200)
  expect((await specification.json()).paths['/api/v1/battles']).toBeDefined()
})
