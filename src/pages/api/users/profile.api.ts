import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession as unstableGetServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const updateProfileBodySchema = z.object({
  bio: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') return res.status(405).end()

  const session = await unstableGetServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  const { bio } = updateProfileBodySchema.parse(req.body)

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      bio,
    },
  })

  return res.status(204).end()
}
