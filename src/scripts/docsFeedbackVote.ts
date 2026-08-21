import type { PayloadHandler } from 'payload'

type VoteType = 'helpful' | 'notHelpful'

const docsFeedbackVote: PayloadHandler = async (req) => {
  try {
    const body = req.json ? await req.json() : {}
    const path = typeof body?.path === 'string' ? body.path.trim() : ''
    const vote = body?.vote as VoteType

    if (!path || (vote !== 'helpful' && vote !== 'notHelpful')) {
      return Response.json(
        { error: 'A valid `path` and `vote` ("helpful" | "notHelpful") are required.' },
        { status: 400 },
      )
    }

    // Increment through the Local API so this works on any database adapter. `path` is unique, so
    // a concurrent create loses the race and is retried as an update below.
    const existing = await req.payload.find({
      collection: 'docs-feedback',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { path: { equals: path } },
    })

    const current = existing.docs[0]

    if (current) {
      await req.payload.update({
        id: current.id,
        collection: 'docs-feedback',
        data: { [vote]: (current[vote] ?? 0) + 1 },
        depth: 0,
        overrideAccess: true,
      })
    } else {
      try {
        await req.payload.create({
          collection: 'docs-feedback',
          data: { path, helpful: 0, notHelpful: 0, [vote]: 1 },
          depth: 0,
          overrideAccess: true,
        })
      } catch {
        // Another request created the row first — fall back to incrementing it.
        const created = await req.payload.find({
          collection: 'docs-feedback',
          depth: 0,
          limit: 1,
          overrideAccess: true,
          pagination: false,
          where: { path: { equals: path } },
        })

        const doc = created.docs[0]

        if (!doc) {
          throw new Error(`Unable to record vote for "${path}"`)
        }

        await req.payload.update({
          id: doc.id,
          collection: 'docs-feedback',
          data: { [vote]: (doc[vote] ?? 0) + 1 },
          depth: 0,
          overrideAccess: true,
        })
      }
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    req.payload.logger.error({ err: error, msg: 'docs-feedback vote failed' })
    return Response.json({ error: 'Failed to record vote' }, { status: 500 })
  }
}

export default docsFeedbackVote
