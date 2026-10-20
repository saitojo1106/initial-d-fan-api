import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import {
  battleSchema,
  catalog,
  characterSchema,
  passSchema,
  recordFor,
  sourceSchema,
  vehicleSchema,
} from './catalog'

const app = new OpenAPIHono()
const listResponse = <T extends z.ZodType>(item: T) => z.object({ data: z.array(item), count: z.number().int().nonnegative() })
const detailResponse = <T extends z.ZodType>(item: T) => z.object({ data: item })
const errorResponse = z.object({ error: z.object({ code: z.literal('NOT_FOUND'), message: z.string() }) })
const idParams = z.object({ id: z.string().min(1).openapi({ param: { name: 'id', in: 'path' }, example: 'akina' }) })
const characterWithRecordSchema = characterSchema.extend({
  record: z.object({ wins: z.number().int(), losses: z.number().int(), total: z.number().int() }),
}).openapi('CharacterWithRecord')

const list = <T>(items: T[]) => ({ data: items, count: items.length })
const notFound = (resource: string, id: string) => ({ error: { code: 'NOT_FOUND' as const, message: `${resource} ${id} was not found` } })
const characterWithRecord = (character: (typeof catalog.characters)[number]) => ({
  ...character,
  record: recordFor(character.id),
})

app.get('/', (c) => c.redirect('/docs'))

app.openapi(createRoute({
  method: 'get', path: '/api/v1/characters', tags: ['Characters'], summary: 'List characters',
  request: { query: z.object({ q: z.string().optional() }) },
  responses: { 200: { description: 'Characters and records from the included battles only', content: { 'application/json': { schema: listResponse(characterWithRecordSchema) } } } },
}), (c) => {
  const { q } = c.req.valid('query')
  const term = q?.trim().toLocaleLowerCase()
  const items = catalog.characters.filter((character) => !term || `${character.name} ${character.id}`.toLocaleLowerCase().includes(term))
  return c.json(list(items.map(characterWithRecord)), 200)
})

app.openapi(createRoute({
  method: 'get', path: '/api/v1/characters/{id}', tags: ['Characters'], summary: 'Get a character',
  request: { params: idParams },
  responses: {
    200: { description: 'Character and record from the included battles only', content: { 'application/json': { schema: detailResponse(characterWithRecordSchema) } } },
    404: { description: 'Character not found', content: { 'application/json': { schema: errorResponse } } },
  },
}), (c) => {
  const { id } = c.req.valid('param')
  const character = catalog.characters.find((item) => item.id === id)
  return character ? c.json({ data: characterWithRecord(character) }, 200) : c.json(notFound('Character', id), 404)
})

app.openapi(createRoute({
  method: 'get', path: '/api/v1/vehicles', tags: ['Vehicles'], summary: 'List vehicle models',
  responses: { 200: { description: 'Vehicle models and base-model specifications', content: { 'application/json': { schema: listResponse(vehicleSchema) } } } },
}), (c) => c.json(list(catalog.vehicles), 200))

app.openapi(createRoute({
  method: 'get', path: '/api/v1/vehicles/{id}', tags: ['Vehicles'], summary: 'Get a vehicle model',
  request: { params: idParams },
  responses: {
    200: { description: 'Vehicle model', content: { 'application/json': { schema: detailResponse(vehicleSchema) } } },
    404: { description: 'Vehicle not found', content: { 'application/json': { schema: errorResponse } } },
  },
}), (c) => {
  const { id } = c.req.valid('param')
  const vehicle = catalog.vehicles.find((item) => item.id === id)
  return vehicle ? c.json({ data: vehicle }, 200) : c.json(notFound('Vehicle', id), 404)
})

app.openapi(createRoute({
  method: 'get', path: '/api/v1/passes', tags: ['Passes'], summary: 'List fictional pass names',
  responses: { 200: { description: 'Pass names without geographic coordinates', content: { 'application/json': { schema: listResponse(passSchema) } } } },
}), (c) => c.json(list(catalog.passes), 200))

app.openapi(createRoute({
  method: 'get', path: '/api/v1/passes/{id}', tags: ['Passes'], summary: 'Get a pass',
  request: { params: idParams },
  responses: {
    200: { description: 'Pass', content: { 'application/json': { schema: detailResponse(passSchema) } } },
    404: { description: 'Pass not found', content: { 'application/json': { schema: errorResponse } } },
  },
}), (c) => {
  const { id } = c.req.valid('param')
  const pass = catalog.passes.find((item) => item.id === id)
  return pass ? c.json({ data: pass }, 200) : c.json(notFound('Pass', id), 404)
})

app.openapi(createRoute({
  method: 'get', path: '/api/v1/battles', tags: ['Battles'], summary: 'List documented battles',
  request: { query: z.object({ characterId: z.string().optional(), passId: z.string().optional() }) },
  responses: { 200: { description: 'Battle results included in this dataset', content: { 'application/json': { schema: listResponse(battleSchema) } } } },
}), (c) => {
  const { characterId, passId } = c.req.valid('query')
  const items = catalog.battles.filter((battle) =>
    (!characterId || battle.participants.some((participant) => participant.characterId === characterId)) &&
    (!passId || battle.passId === passId),
  )
  return c.json(list(items), 200)
})

app.openapi(createRoute({
  method: 'get', path: '/api/v1/battles/{id}', tags: ['Battles'], summary: 'Get a documented battle',
  request: { params: idParams },
  responses: {
    200: { description: 'Battle', content: { 'application/json': { schema: detailResponse(battleSchema) } } },
    404: { description: 'Battle not found', content: { 'application/json': { schema: errorResponse } } },
  },
}), (c) => {
  const { id } = c.req.valid('param')
  const battle = catalog.battles.find((item) => item.id === id)
  return battle ? c.json({ data: battle }, 200) : c.json(notFound('Battle', id), 404)
})

app.openapi(createRoute({
  method: 'get', path: '/api/v1/sources', tags: ['Sources'], summary: 'List citations for the seed data',
  responses: { 200: { description: 'Source registry', content: { 'application/json': { schema: listResponse(sourceSchema) } } } },
}), (c) => c.json(list(catalog.sources), 200))

app.doc31('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'Initial D Fan API',
    version: '0.1.0',
    description: 'Unofficial, non-affiliated read-only API. Character records count only battles included in this dataset. No images, maps or story text are provided.',
  },
})
app.get('/docs', Scalar({ url: '/openapi.json' }))

export default app
