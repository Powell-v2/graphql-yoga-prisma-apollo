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

const typeDefs = `
  type Query {
    me: User!
    post: Post!
    users(query: String): [User!]!
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
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is up @localhost:4000 🚀'))
