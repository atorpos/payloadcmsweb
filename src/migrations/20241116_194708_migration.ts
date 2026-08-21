import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'
import type { Payload } from 'payload'

import { migrateRelationshipsV2_V3 } from '@payloadcms/db-mongodb/migration-utils'

/**
 * Collections Payload keeps for its own bookkeeping. None of them hold v2-style
 * relationships, and Payload writes to several of them (preferences, locks) the
 * moment anybody opens the admin panel — so their contents are not evidence that
 * the database holds real content.
 */
const INTERNAL_COLLECTIONS = [
  'payload-jobs',
  'payload-kvs',
  'payload-locked-documents',
  'payload-migrations',
  'payload-preferences',
]

/**
 * Reports whether the database holds any documents worth migrating.
 *
 * Deliberately queried without the migration's session: this runs before the
 * rewrite below and must not take part in — or contend with — its transaction.
 */
const hasDocumentsToMigrate = async (payload: Payload): Promise<boolean> => {
  const db = payload.db.connection.db

  // Without a handle on the raw database we cannot prove the database is empty,
  // so assume it is not and let the migration run.
  if (!db) {
    return true
  }

  const collections = await db.listCollections({}, { nameOnly: true }).toArray()

  for (const { name } of collections) {
    if (INTERNAL_COLLECTIONS.includes(name)) {
      continue
    }

    if ((await db.collection(name).countDocuments({}, { limit: 1 })) > 0) {
      return true
    }
  }

  return false
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // `migrateRelationshipsV2_V3` rewrites every document into the v3 relationship
  // shape. A database Payload 3 created itself is already in that shape, so on a
  // fresh install the pass is pure overhead — and because it rewrites the whole
  // database inside one transaction, it competes with the index builds Mongoose
  // starts on connect and fails with `LockTimeout`, taking `pnpm build` with it.
  if (!(await hasDocumentsToMigrate(payload))) {
    payload.logger.info(
      'Database is empty — skipping the v2 to v3 relationship migration, there is nothing to convert.',
    )

    return
  }

  await migrateRelationshipsV2_V3({
    batchSize: 100,
    req,
  })
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Migration code
}
