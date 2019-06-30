import bcrypt from 'bcryptjs'

import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

export default {
  async login(_parent, { data }, { prisma }) {
    const { email, password } = data

    const user = await prisma.query.user({ where: { email }})
    if (!user) {
      throw new Error(`Unable to login.`)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error(`Unable to login.`)
    }

    return { user, token: generateToken(user) }
  },
  async createUser(_parent, { data }, { prisma }, _info) {
    const { password } = data

    const hashedPassword = await hashPassword(password)
    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password: hashedPassword,
      }
    })

    return { user, token: generateToken(user) }
  },
  updateUser: async(_parent, { data }, { prisma, request }, info) =>
    prisma.mutation.updateUser({
      data: {
        ...data,
        ...(data.password && {
          password: await hashPassword(data.password)
        })
      },
      where: { id: getUserId(request) }
    }, info),
  deleteUser: (_parent, _args, { prisma, request }, info) =>
    prisma.mutation.deleteUser({
      where: { id: getUserId(request) }
    }, info),
  createPost: (_parent, { data }, { prisma, request }, info) =>
    prisma.mutation.createPost({
      data: {
        ...data,
        author: { connect: { id: getUserId(request) }},
      }
    }, info),
  async updatePost(_parent, args, { prisma, request }, info) {
    const { data, id } = args
    const postExists = await prisma.exists.Post({
      id,
      author: { id: getUserId(request) }
    })

    if (!postExists) {
      throw new Error(`Unable to update post.`)
    }

    const isPostPublished = await prisma.exists.Post({
      id,
      published: true,
    })

    if (isPostPublished && (data.published === false)) {
      await prisma.mutation.deleteManyComments({
        where: { post: { id }}
      })
    }

    return prisma.mutation.updatePost({
      data,
      where: { id }
    }, info)
  },
  async deletePost(_parent, { id }, { prisma, request }, info) {
    const postExists = await prisma.exists.Post({
      id,
      author: { id: getUserId(request) }
    })

    if (!postExists) {
      throw new Error(`Unable to delete post.`)
    }

    return prisma.mutation.deletePost({ where: { id }}, info)
  },
  async createComment(_parent, args, { prisma, request }, info) {
    const { postId, data } = args

    const postExists = await prisma.exists.Post({
      id: postId,
      published: true,
    })

    if (!postExists) {
      throw new Error(`Unable to add comment.`)
    }

    return prisma.mutation.createComment({
      data: {
        ...data,
        author: { connect: { id: getUserId(request) }},
        post: { connect: { id: postId }},
      }
    }, info)
  },
  async updateComment(_parent, args, { prisma , request }, info) {
    const { id, data } = args
    const commentExists = await prisma.exists.Comment({
      id,
      author: { id: getUserId(request) }
    })

    if (!commentExists) {
      throw new Error(`Unable to update comment.`)
    }

    return prisma.mutation.updateComment({ data, where: { id }}, info)
  },
  async deleteComment(_parent, { id }, { prisma, request }, info) {
    const commentExists = await prisma.exists.Comment({
      id,
      author: { id: getUserId(request) }
    })

    if (!commentExists) {
      throw new Error(`Unable to delete comment.`)
    }

    return prisma.mutation.deleteComment({ where: { id }}, info)
  },
}
