import { z } from '@hono/zod-openapi'
import seed from '../data/catalog.json'

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const sourceIds = z.array(id).min(1)

export const sourceSchema = z.object({
  id,
  title: z.string().min(1),
  url: z.url(),
  publisher: z.string().min(1),
  checkedOn: z.iso.date(),
}).strict().openapi('Source')

export const characterSchema = z.object({
  id,
  name: z.string().min(1),
  vehicleIds: z.array(id).min(1),
  sourceIds,
}).strict().openapi('Character')

export const vehicleSchema = z.object({
  id,
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  specifications: z.object({
    chassisCode: z.string().min(1).optional(),
    engineFamily: z.string().min(1).optional(),
    driveLayout: z.enum(['FR', 'FF', '4WD', 'MR', 'RR']).optional(),
  }).strict(),
  sourceIds,
}).strict().openapi('Vehicle')

export const passSchema = z.object({
  id,
  name: z.string().min(1),
  sourceIds,
}).strict().openapi('Pass')

export const battleSchema = z.object({
  id,
  passId: id,
  participants: z.tuple([
    z.object({ characterId: id, vehicleId: id }).strict(),
    z.object({ characterId: id, vehicleId: id }).strict(),
  ]),
  winnerCharacterId: id,
  sourceIds,
}).strict().openapi('Battle')

const catalogSchema = z.object({
  sources: z.array(sourceSchema),
  characters: z.array(characterSchema),
  vehicles: z.array(vehicleSchema),
  passes: z.array(passSchema),
  battles: z.array(battleSchema),
}).strict()

export type Catalog = z.infer<typeof catalogSchema>

export function validateCatalog(input: unknown): Catalog {
  const catalog = catalogSchema.parse(input)
  const byId = <T extends { id: string }>(items: T[], name: string) => {
    const map = new Map(items.map((item) => [item.id, item]))
    if (map.size !== items.length) throw new Error(`Duplicate ${name} ID`)
    return map
  }
  const sources = byId(catalog.sources, 'source')
  const characters = byId(catalog.characters, 'character')
  const vehicles = byId(catalog.vehicles, 'vehicle')
  const passes = byId(catalog.passes, 'pass')
  byId(catalog.battles, 'battle')

  for (const item of [...catalog.characters, ...catalog.vehicles, ...catalog.passes, ...catalog.battles]) {
    for (const sourceId of item.sourceIds) {
      if (!sources.has(sourceId)) throw new Error(`${item.id}: unknown source ${sourceId}`)
    }
  }
  for (const character of catalog.characters) {
    for (const vehicleId of character.vehicleIds) {
      if (!vehicles.has(vehicleId)) throw new Error(`${character.id}: unknown vehicle ${vehicleId}`)
    }
  }
  for (const battle of catalog.battles) {
    if (!passes.has(battle.passId)) throw new Error(`${battle.id}: unknown pass ${battle.passId}`)
    const participants = new Set<string>()
    for (const participant of battle.participants) {
      const character = characters.get(participant.characterId)
      if (!character) throw new Error(`${battle.id}: unknown character ${participant.characterId}`)
      if (!character.vehicleIds.includes(participant.vehicleId)) {
        throw new Error(`${battle.id}: vehicle ${participant.vehicleId} is not linked to ${character.id}`)
      }
      participants.add(character.id)
    }
    if (participants.size !== 2) throw new Error(`${battle.id}: participants must be distinct`)
    if (!participants.has(battle.winnerCharacterId)) {
      throw new Error(`${battle.id}: winner is not a participant`)
    }
  }
  return catalog
}

export const catalog = validateCatalog(seed)

export function recordFor(characterId: string) {
  const battles = catalog.battles.filter((battle) =>
    battle.participants.some((participant) => participant.characterId === characterId),
  )
  const wins = battles.filter((battle) => battle.winnerCharacterId === characterId).length
  return { wins, losses: battles.length - wins, total: battles.length }
}
