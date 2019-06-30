`use strict`
import { Prisma } from 'prisma-binding'

import { fragmentReplacements } from './resolvers'

export default new Prisma({
  typeDefs: `src/generated/prisma.graphql`,
  endpoint: `http://localhost:4466`,
  secret: `very-much-clandestine`,
  fragmentReplacements,
})
