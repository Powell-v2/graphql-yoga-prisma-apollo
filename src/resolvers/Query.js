const Query = {
  me: () => ({
    id: `383849`,
    name: `Paul Ye`,
    age: 9,
    employed: true,
  }),
  users: (_parent, { query }, { db }, _info) => {
    if (query) {
      return db.users.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
    }
    return db.users
  },
  posts: (_parent, { query }, { db }, _info) => {
    if (query) {
      return db.posts.filter(({ title, body }) => {
        const isTitleMatch = title.toLowerCase().includes(query.toLowerCase())
        const isBodyMatch = body.toLowerCase().includes(query.toLowerCase())

        return isTitleMatch || isBodyMatch
      })
    }
    return db.posts
  },
  comments: (_parent, _query, { db }) => db.comments,
}

export default Query
