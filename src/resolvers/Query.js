`use strict`
import getUserId from '../utils/getUserId'

const Query = {
  me: (_parent, _args, { prisma, request }, info) => {
    const user = prisma.query.user({
      where: { id: getUserId(request) }
    }, info)

    if (!user) {
      throw new Error(`Cannot get user data.`)
    }

    return user
  },
  users: (_parent, { query }, { prisma }, info) => {
    const operationalArguments = {}

    if (query) {
      operationalArguments.where = {
        OR: [
          {
            name_contains: query,
          },
          {
            email_contains: query,
          }
        ]
      }
    }

    return prisma.query.users(operationalArguments, info)
  },
  async post(_parent, { id }, { prisma, request }, info) {
    const [ post ] = await prisma.query.posts({
      where: {
        id,
        OR: [
          {
            published: true,
          },
          {
            author: {
              id: getUserId(request, false)
            },
          },
        ],
      },
    }, info)

    if (!post) {
      throw new Error(`Post not found.`)
    }

    return post
  },
  posts: (_parent, { query }, { prisma }, info) => {
    const operationalArguments = {
      where: {
        published: true,
      },
    }

    if (query) {
      operationalArguments.where.OR = [
        {
          title_contains: query,
        },
        {
          body_contains: query,
        }
      ]
    }

    return prisma.query.posts(operationalArguments, info)
  },
  myPosts: (_parent, { query }, { prisma, request }, info) => {
    const operationArgs = {
      where: {
        author: {
          id: getUserId(request),
        },
      },
    }

    if (query) {
      operationArgs.where.OR = [
        {
          title_contains: query,
        },
        {
          body_contains: query,
        }
      ]
    }

    return prisma.query.posts(operationArgs, info)
  },
  comments: (_parent, { query }, { prisma }, info) => {
    const operationalArguments = {}

    if (query) {
      operationalArguments.where = {
        OR: [
          {
            text_contains: query,
          },
          {
            author_contains: query,
          }
        ]
      }
    }

    return prisma.query.comments(operationalArguments, info)
  },
}

export default Query
