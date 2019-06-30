import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import getUserId from '../utils/getUserId'

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

    return {
      user,
      token: jwt.sign({ userId: user.id }, `suchasecret`),
    }
  },
  async createUser(_parent, { data }, { prisma }, _info) {
    const { password } = data
    if (password.length < 8) {
      throw new Error(`Password must be longer than 7 symbols.`)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password: hashedPassword,
      }
    })

    return {
      user,
      token: jwt.sign({ userId: user.id }, `suchasecret`),
    }
  },
  updateUser(_parent, { data }, { prisma, request }, info) {
    return prisma.mutation.updateUser({
      data,
      where: { id: getUserId(request) }
    }, info)
  },
  deleteUser(_parent, _args, { prisma, request }, info) {
    return prisma.mutation.deleteUser({
      where: { id: getUserId(request) }
    }, info)
  },
  createPost(_parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.createPost({
      data: {
        ...data,
        author: { connect: { id: userId }},
      }
    }, info)
  },
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
