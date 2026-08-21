import type { Block, DBIdentifierName, Field } from 'payload'

import { createHash } from 'crypto'

/**
 * Relational adapters (`@payloadcms/db-sqlite`, `@payloadcms/db-postgres`) derive table and enum
 * names by concatenating the whole path to a field, and `@payloadcms/drizzle` rejects any name
 * longer than Postgres' 63 character limit.
 *
 * Most blocks in this config wrap their fields in a group named `<blockSlug>Fields`, so the block
 * slug ends up in the generated name twice — `case_studies_blocks_card_grid_card_grid_fields_...`.
 * That pushes a couple hundred identifiers past the limit, which is why `payload migrate` fails
 * with `Exceeded max identifier length for table or enum name of 63 characters`.
 *
 * Rather than hand-maintaining a `dbName` on every offending block, array and select, the helpers
 * below walk the config and install `dbName`/`enumName` callbacks that shorten a name *only* when
 * Payload's own name would be too long. Everything that already fits keeps its readable default.
 */

/** Postgres max identifier length (NAMEDATALEN - 1), enforced by `@payloadcms/drizzle`. */
const MAX_IDENTIFIER_LENGTH = 63

/**
 * A custom name returned for a versioned table is wrapped as `_<name>_v`, so leave room for those
 * three extra characters.
 */
const MAX_CUSTOM_LENGTH = MAX_IDENTIFIER_LENGTH - 3

/** Characters of the digest appended to a truncated name to keep it unique. */
const HASH_LENGTH = 8

/**
 * Ports `to-snake-case` (used internally by `@payloadcms/drizzle`) so the default name we measure
 * matches the one Payload would generate.
 */
const toSnakeCase = (input: string): string => {
  let noCase: string

  if (/\s/.test(input)) {
    noCase = input.toLowerCase()
  } else if (/(_|-|\.|:)/.test(input)) {
    noCase = (
      input.replace(/[\W_]+(.|$)/g, (_, next) => (next ? ` ${next}` : '')) || input
    ).toLowerCase()
  } else if (/([a-z][A-Z]|[A-Z][a-z])/.test(input)) {
    noCase = input
      .replace(/(.)([A-Z]+)/g, (_, previous, uppers) => {
        return `${previous} ${uppers.toLowerCase().split('').join(' ')}`
      })
      .toLowerCase()
  } else {
    noCase = input.toLowerCase()
  }

  return noCase
    .replace(/[\W_]+(.|$)/g, (_, next) => (next ? ` ${next}` : ''))
    .trim()
    .replace(/\s/g, '_')
}

/**
 * Returns a name for `defaultName` — the default itself when it already fits, otherwise a
 * shortened, collision-free replacement.
 *
 * This must always return a non-empty string. `createTableName` wraps a custom name for a
 * versioned table as `_<name>_v`, and it does that *before* falling back to its own name, so
 * returning `''` there yields `__v` for every block and array inside a version table. They then
 * all collide, get disambiguated into `__v_2`, `__v_3`, … and the block index that disambiguation
 * writes onto the shared block objects leaks into non-versioned queries, which fail with
 * `Cannot read properties of undefined (reading 'referencedTable')`.
 */
const shortenIfNeeded = (defaultName: string): string => {
  if (defaultName.length <= MAX_CUSTOM_LENGTH) {
    return defaultName
  }

  // Hashing the full default name keeps the result stable across runs and unique across fields
  // that happen to share a truncated prefix.
  const hash = createHash('sha256').update(defaultName).digest('hex').slice(0, HASH_LENGTH)

  return `${defaultName.slice(0, MAX_CUSTOM_LENGTH - HASH_LENGTH - 1)}_${hash}`
}

const identifier =
  (buildDefaultName: (parentTableName: string) => string): DBIdentifierName =>
  ({ tableName }) =>
    shortenIfNeeded(buildDefaultName(tableName ?? ''))

const shortenFields = (fields: Field[]): void => {
  fields.forEach((field) => {
    switch (field.type) {
      case 'array': {
        // Arrays get their own table, named `<parentTable>_<fieldName>`.
        if (!field.dbName) {
          field.dbName = identifier((parent) => `${parent}_${toSnakeCase(field.name)}`)
        }
        shortenFields(field.fields)
        break
      }

      case 'blocks': {
        if (Array.isArray(field.blocks)) {
          shortenBlocks(field.blocks)
        }

        // `blockReferences` mixes slugs — which resolve to the config-level `blocks`, shortened
        // separately — with inline block definitions that are only reachable from here.
        if (Array.isArray(field.blockReferences)) {
          shortenBlocks(field.blockReferences.filter((block) => typeof block !== 'string'))
        }
        break
      }

      case 'collapsible':
      case 'group':
      case 'row': {
        // Not tables of their own, but their fields still contribute to descendants' names.
        shortenFields(field.fields)
        break
      }

      case 'radio': {
        // Radios get an enum named `enum_<parentTable>_<fieldName>`, even on SQLite, where the
        // value is stored as text but the name is still validated.
        if (!field.enumName) {
          field.enumName = identifier((parent) => `enum_${parent}_${toSnakeCase(field.name)}`)
        }
        break
      }

      case 'select': {
        if (!field.enumName) {
          field.enumName = identifier((parent) => `enum_${parent}_${toSnakeCase(field.name)}`)
        }

        // `hasMany` selects additionally get a join table named `<parentTable>_<fieldName>`.
        if (field.hasMany && !field.dbName) {
          field.dbName = identifier((parent) => `${parent}_${toSnakeCase(field.name)}`)
        }
        break
      }

      case 'tabs': {
        field.tabs.forEach((tab) => shortenFields(tab.fields))
        break
      }

      default:
        break
    }
  })
}

/**
 * Installs shortened `dbName`s on blocks (and everything nested inside them). Safe to call more
 * than once for the same block — the generated names are deterministic and existing `dbName`s are
 * left alone.
 */
export const shortenBlocks = <T extends Block>(blocks: T[]): T[] => {
  blocks.forEach((block) => {
    if (!block.dbName) {
      block.dbName = identifier((parent) => `${parent}_blocks_${toSnakeCase(block.slug)}`)
    }

    shortenFields(block.fields)
  })

  return blocks
}

/**
 * Installs shortened table and enum names throughout a set of collections or globals.
 */
export const shortenEntities = <T extends { fields: Field[] }>(entities: T[]): T[] => {
  entities.forEach((entity) => shortenFields(entity.fields))

  return entities
}
