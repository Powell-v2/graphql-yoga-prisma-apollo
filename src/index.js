'use strict'

import { GraphQLServer } from 'graphql-yoga'

// demo user data
const users = [
  {
    id: `55`,
    name: `Alessio`,
    employed: false,
  },
  {
    id: `44`,
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
    author: `55`,
  },
  {
    id: `6`,
    title: `What the heck is monkey patching?`,
    body: `Ask the monkeys!`,
    published: true,
    author: `55`,
  },
  {
    id: `3`,
    title: `Rebbbbasse`,
    body: `Use rebase sparingly!`,
    published: true,
    author: `44`,
  }
]

// demo comments data
const comments = [
  {
    id: `111`,
    text: `Awesome!`,
  },
  {
    id: `222`,
    text: `Splendid!`,
  },
  {
    id: `333`,
    text: `Way to go!`,
  },
  {
    id: `444`,
    text: `Kickass!`,
  },
]

const typeDefs = `
  type Query {
    me: User!
    post: Post!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }
  type User {
    id: ID!
    name: String!
    age: Int
    employed: Boolean!
    posts: [Post!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User
  }
  type Comment {
    id: ID!
    text: String!
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
    comments: () => comments
  },
  Post: {
    author: ({ author }) => users.find(({ id }) => id === author)
  },
  User: {
    posts: ({ id }) => posts.filter(({ author }) => author === id)
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is up @localhost:4000 🚀'))
