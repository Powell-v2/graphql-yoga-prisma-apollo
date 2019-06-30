`use strict`
import getUserId from '../utils/getUserId'

export default {
  email: {
    fragment: `fragment userId on User { id }`,
    resolve(parent, _args, { request }, _info) {
      const userId = getUserId(request, false)

      if (userId && (userId === parent.id)) {
        return parent.email
      }

      return null
    }
  },
  posts: {
    fragment: `fragment userId on User { id }`,
    resolve: ({ id }, _args, { prisma }, _info) => (
      prisma.query.posts({
        where: {
          published: true,
          author: { id },
        },
      })
    )
  }
}
