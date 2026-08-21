const SUPPORTED_PROTOCOLS = ['mongodb://', 'mongodb+srv://']

/**
 * Resolves and validates `DATABASE_URI` before it reaches Mongoose.
 *
 * Payload passes the raw value straight through to the driver, so an unset or
 * malformed variable surfaces as `Invalid scheme, expected connection string to
 * start with "mongodb://"` thrown from deep inside `@payloadcms/db-mongodb`.
 * Validating here names the actual problem — the environment — instead.
 */
export const getDatabaseURI = (): string => {
  const uri = process.env.DATABASE_URI?.trim()

  if (!uri) {
    throw new Error(
      'Missing DATABASE_URI. Run `cp .env.example .env` and point DATABASE_URI at your MongoDB instance, e.g. mongodb://127.0.0.1:27017/payload-website',
    )
  }

  if (!SUPPORTED_PROTOCOLS.some((protocol) => uri.startsWith(protocol))) {
    // Report the scheme only — the rest of the URI usually carries credentials.
    const scheme = uri.includes('://') ? `${uri.split('://')[0]}://` : '(none)'

    throw new Error(
      `Invalid DATABASE_URI: expected a connection string starting with "mongodb://" or "mongodb+srv://", but the scheme was ${scheme}`,
    )
  }

  return uri
}
