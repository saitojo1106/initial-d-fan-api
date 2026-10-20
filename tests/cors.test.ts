import { expect, test } from 'bun:test'
import app from '../src/app'

test('public API supports cross-origin browser requests', async () => {
  const response = await app.request('/api/v1/characters', {
    headers: { Origin: 'https://example.com' },
  })
  expect(response.status).toBe(200)
  expect(response.headers.get('access-control-allow-origin')).toBe('*')

  const preflight = await app.request('/api/v1/characters', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://example.com',
      'Access-Control-Request-Method': 'GET',
    },
  })
  expect(preflight.status).toBe(204)
  expect(preflight.headers.get('access-control-allow-origin')).toBe('*')
})
