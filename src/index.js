'use strict'

import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
  type Query {
    me: User!
  }
  type User {
    id: ID!
    name: String!
    age: Int
    employed: Boolean!
  }
`

const resolvers = {
  Query: {
    me: () => ({
      id: `383849`,
      name: `Paul Ye`,
      age: 9,
      employed: true,
    })
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is up @localhost:4000 🚀'))
