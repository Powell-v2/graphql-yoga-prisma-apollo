const Query = {
  me: () => ({
    id: `383849`,
    name: `Paul Ye`,
    age: 9,
    employed: true,
  }),
  users: (_parent, { query }, { prisma }, info) => {
    const operationalArguments = {}

    if (query) {
      operationalArguments.where = {
        OR: [
          {
            name_contains: query,
          },
          {
            email_contains: query,
          }
        ]
      }
    }

    return prisma.query.users(operationalArguments, info)
  },
  posts: (_parent, { query }, { prisma }, info) => {
    const operationalArguments = {}

    if (query) {
      operationalArguments.where = {
        OR: [
          {
            title_contains: query,
          },
          {
            body_contains: query,
          }
        ]
      }
    }

    return prisma.query.posts(operationalArguments, info)
  },
  comments: (_parent, _query, { db }) => db.comments,
}

export default Query
