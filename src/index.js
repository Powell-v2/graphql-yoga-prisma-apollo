'use strict'

import { GraphQLServer } from 'graphql-yoga'

// demo user data
const users = [
  {
    id: `5546`,
    name: `Alessio`,
    employed: false,
  },
  {
    id: `46534`,
    name: `Josie`,
    employed: true,
  }
]

// demo posts data
const posts = [
  {
    id: `5`,
    title: `What the heck is duck typing?`,
    body: `Ask the ducks!`,
    published: true,
  },
  {
    id: `3`,
    title: `Rebbbbasse`,
    body: `Use rebase sparingly!`,
    published: true,
  }
]

const typeDefs = `
  type Query {
    me: User!
    post: Post!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
  }
  type User {
    id: ID!
    name: String!
    age: Int
    employed: Boolean!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`

const resolvers = {
  Query: {
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
    users: (_parent, { query }, _ctx, _info) => {
      if (query) {
        return users.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
      }
      return users
    },
    posts: (_parent, { query }, _ctx, _info) => {
      if (query) {
        return posts.filter(({ title, body }) => {
          const isTitleMatch = title.toLowerCase().includes(query.toLowerCase())
          const isBodyMatch = body.toLowerCase().includes(query.toLowerCase())

          return isTitleMatch || isBodyMatch
        })
      }
      return posts
    },
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is up @localhost:4000 🚀'))
