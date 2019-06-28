'use strict'
import { GraphQLServer, PubSub } from 'graphql-yoga'

import db from './db'
import prisma from './prisma'

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
  },
  context(request) {
    return {
      db,
      pubsub,
      prisma,
      request,    
    }
  }
})

server.start(() => console.log('Server is up @localhost:4000 🚀'))
