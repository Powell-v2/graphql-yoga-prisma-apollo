`use strict`
import { Prisma } from 'prisma-binding'

import { fragmentReplacements } from './resolvers'

export default new Prisma({
  typeDefs: `src/generated/prisma.graphql`,
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements,
})
