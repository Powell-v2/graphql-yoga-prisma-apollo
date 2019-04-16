const Query = {
  me: () => ({
    id: `383849`,
    name: `Paul Ye`,
    age: 9,
    employed: true,
  }),
  post: () => ({
    id: `997`,
    title: `Rebbbbasse`,
    body: `Use rebase sparingly!`,
    published: true,
  }),
  users: (_parent, { query }, { db }, _info) => {
    if (query) {
      return db.users.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
    }
    return users
  },
  posts: (_parent, { query }, { db }, _info) => {
    if (query) {
      return db.posts.filter(({ title, body }) => {
        const isTitleMatch = title.toLowerCase().includes(query.toLowerCase())
        const isBodyMatch = body.toLowerCase().includes(query.toLowerCase())

        return isTitleMatch || isBodyMatch
      })
    }
    return posts
  },
  comments: () => comments,
}

export default Query
