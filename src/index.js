'use strict'
import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// demo user data
let users = [
  {
    id: `55`,
    name: `Alessio`,
    email: `alessio@email.org`,
    employed: false,
  },
  {
    id: `44`,
    name: `Josie`,
    email: `josie@email.org`,
    employed: true,
  }
]

// demo posts data
let posts = [
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
let comments = [
  {
    id: `111`,
    text: `Awesome!`,
    author: `55`,
    post: `6`,
  },
  {
    id: `222`,
    text: `Splendid!`,
    author: `44`,
    post: `5`,
  },
  {
    id: `333`,
    text: `Way to go!`,
    author: `55`,
    post: `3`,
  },
  {
    id: `444`,
    text: `Kickass!`,
    author: `44`,
    post: `6`,
  },
]

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
    comments: () => comments,
  },
  Mutation: {
    createUser: (_, { data }) => {
      const isUserTaken = users.some(({ email }) => email === data.email)

      if (isUserTaken) throw new Error ('Email is already taken.')

      const user = {
        id: uuidv4(),
        ...data,
      }
      users.push(user)

      return user
    },
    deleteUser: (_, args) => {
      const userIdx = users.findIndex((user) => args.id === user.id)

      if (userIdx === -1) throw new Error (`User wasn't found.`)

      posts = posts.filter((post) => {
        const match = post.author === args.id

        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id)
        }

        return !match
      })

      comments = comments.filter((comment) => comment.author !== args.id)

      return users.splice(userIdx, 1)[0]
    },
    createPost: (_, { data }) => {
      const userExists = users.some(({ id }) => id === data.author)

      if (!userExists) throw new Error (`User wasn't found.`)

      const post = {
        id: uuidv4(),
        ...data,
      }
      posts.push(post)

      return post
    },
    deletePost: (_, args) => {
      const postIdx = posts.findIndex((post) => args.id === post.id)

      if (postIdx === -1) throw new Error (`Post wasn't found.`)

      comments = comments.filter((comment) => comment.post !== args.id)

      return posts.splice(postIdx, 1)[0]
    },
    createComment: (_, { data }) => {
      const userExists = users.some(({ id }) => id === data.author)
      const postExists = posts.some(({ id }) => id === data.post)

      if (!userExists) throw new Error (`User wasn't found.`)
      if (!postExists) throw new Error (`Post wasn't found.`)

      const comment = {
        id: uuidv4(),
        ...data,
      }
      comments.push(comment)

      return comment
    },
    deleteComment: (_, args) => {
      const commentIdx = comments.findIndex((comment) => args.id === comment.id)

      if (commentIdx === -1) throw new Error (`Comment wasn't found.`)

      return comments.splice(commentIdx, 1)[0]
    },
  },
  Post: {
    author: ({ author: authorId }) => users.find(({ id }) => id === authorId),
    comments: ({ id }) => comments.filter(({ post: postId }) => postId === id),
  },
  User: {
    posts: ({ id }) => posts.filter(({ author }) => author === id),
    comments: ({ id }) => comments.filter(({ author }) => id === author),
  },
  Comment: {
    author: ({ author }) => users.find(({ id }) => id === author),
    post: ({ post: postId }) => posts.find(({ id }) => id === postId),
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
})

server.start(() => console.log('Server is up @localhost:4000 🚀'))
