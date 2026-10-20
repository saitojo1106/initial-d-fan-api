import { describe, expect, test } from 'bun:test'
import app from '../src/app'

const legacyHost = 'https://api.saitoudayooooon-jo.com'
const currentHost = 'https://initial-d-fan-api.saitoudayooooon-jo.com'

describe('legacy hostname redirect', () => {
  test('permanently redirects the legacy hostname and keeps the path and query', async () => {
    const response = await app.request(`${legacyHost}/api/v1/characters?q=藤原`)
    expect(response.status).toBe(301)
    expect(response.headers.get('location')).toBe(new URL(`${currentHost}/api/v1/characters?q=藤原`).href)
  })

  test('redirects the documentation and OpenAPI paths too', async () => {
    for (const path of ['/docs', '/openapi.json']) {
      const response = await app.request(`${legacyHost}${path}`)
      expect(response.status).toBe(301)
      expect(response.headers.get('location')).toBe(`${currentHost}${path}`)
    }
  })

  test('serves the current hostname and other hosts directly', async () => {
    for (const origin of [currentHost, 'https://example.workers.dev']) {
      const response = await app.request(`${origin}/api/v1/characters?q=藤原`)
      expect(response.status).toBe(200)
      expect((await response.json()).data.map((item: { id: string }) => item.id)).toEqual(['takumi-fujiwara'])
    }
  })
})
