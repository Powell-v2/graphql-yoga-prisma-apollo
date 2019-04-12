'use strict'

import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
  type Query {
    me: User!
    post: Post!
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
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is up @localhost:4000 🚀'))
