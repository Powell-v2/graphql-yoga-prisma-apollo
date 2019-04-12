'use strict'

import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
  type Query {
    hi(name: String): String!
  }
`

const resolvers = {
  Query: {
    hi(_, { name }) {
      return `Hey, ${name || 'you'}!`
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is up @localhost:4000 🚀'))
