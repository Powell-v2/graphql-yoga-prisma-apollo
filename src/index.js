'use strict'
import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

import db from './db'

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
    users: (_parent, { query }, ctx, _info) => {
      if (query) {
        return ctx.users.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
      }
      return users
    },
    posts: (_parent, { query }, ctx, _info) => {
      if (query) {
        return ctx.posts.filter(({ title, body }) => {
          const isTitleMatch = title.toLowerCase().includes(query.toLowerCase())
          const isBodyMatch = body.toLowerCase().includes(query.toLowerCase())

          return isTitleMatch || isBodyMatch
        })
      }
      return posts
    },
    comments: () => comments,
  },
  Mutation: {
    createUser: (_parent, { data }, ctx) => {
      const isUserTaken = ctx.users.some(({ email }) => email === data.email)

      if (isUserTaken) throw new Error ('Email is already taken.')

      const user = {
        id: uuidv4(),
        ...data,
      }
      ctx.users.push(user)

      return user
    },
    deleteUser: (_parent, args, ctx) => {
      const userIdx = ctx.users.findIndex((user) => args.id === user.id)

      if (userIdx === -1) throw new Error (`User wasn't found.`)

      posts = ctx.posts.filter((post) => {
        const match = post.author === args.id

        if (match) {
          comments = ctx.comments.filter((comment) => comment.post !== post.id)
        }

        return !match
      })

      comments = ctx.comments.filter((comment) => comment.author !== args.id)

      return ctx.users.splice(userIdx, 1)[0]
    },
    createPost: (_parent, { data }, ctx) => {
      const userExists = ctx.users.some(({ id }) => id === data.author)

      if (!userExists) throw new Error (`User wasn't found.`)

      const post = {
        id: uuidv4(),
        ...data,
      }
      ctx.posts.push(post)

      return post
    },
    deletePost: (_parent, args, ctx) => {
      const postIdx = ctx.posts.findIndex((post) => args.id === post.id)

      if (postIdx === -1) throw new Error (`Post wasn't found.`)

      comments = ctx.comments.filter((comment) => comment.post !== args.id)

      return ctx.posts.splice(postIdx, 1)[0]
    },
    createComment: (_parent, { data }, ctx) => {
      const userExists = ctx.users.some(({ id }) => id === data.author)
      const postExists = ctx.posts.some(({ id }) => id === data.post)

      if (!userExists) throw new Error (`User wasn't found.`)
      if (!postExists) throw new Error (`Post wasn't found.`)

      const comment = {
        id: uuidv4(),
        ...data,
      }
      ctx.comments.push(comment)

      return comment
    },
    deleteComment: (_parent, args, ctx) => {
      const commentIdx = ctx.comments.findIndex((comment) => args.id === comment.id)

      if (commentIdx === -1) throw new Error (`Comment wasn't found.`)

      return ctx.comments.splice(commentIdx, 1)[0]
    },
  },
  Post: {
    author: ({ author: authorId }, _args, ctx) => ctx.users.find(({ id }) => id === authorId),
    comments: ({ id }, _args, ctx) => ctx.comments.filter(({ post: postId }) => postId === id),
  },
  User: {
    posts: ({ id }, _args, ctx) => ctx.posts.filter(({ author }) => author === id),
    comments: ({ id }, _args, ctx) => ctx.comments.filter(({ author }) => id === author),
  },
  Comment: {
    author: ({ author }, _args, ctx) => ctx.users.find(({ id }) => id === author),
    post: ({ post: postId }, _args, ctx) => ctx.posts.find(({ id }) => id === postId),
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: db,
})

server.start(() => console.log('Server is up @localhost:4000 🚀'))
