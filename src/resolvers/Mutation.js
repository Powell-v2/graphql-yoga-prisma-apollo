export default {
  createUser(_parent, { data }, { prisma }, info) {
    return prisma.mutation.createUser({ data }, info)
  },
  updateUser(_parent, args, { prisma }, info) {
    const { id, data } = args

    return prisma.mutation.updateUser({ data, where: { id }}, info)
  },
  deleteUser(_parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteUser({ where: { id }}, info)
  },
  createPost(_parent, { data }, { prisma }, info) {
    return prisma.mutation.createPost({
      data: {
        ...data,
        author: { connect: { id: data.author }},
      }
    }, info)
  },
  updatePost(_parent, args, { prisma }, info) {
    const { id, data } = args

    return prisma.mutation.updatePost({ data, where: { id }}, info)
  },
  deletePost(_parent, { id }, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id }}, info)
  },
  createComment(_parent, { data }, { prisma }, info) {
    return prisma.mutation.createComment({
      data: {
        ...data,
        author: { connect: { id: data.author }},
        post: { connect: { id: data.post }},
      }
    }, info)
  },
  updateComment(_parent, args, { prisma }, info) {
    const { id, data } = args

    return prisma.mutation.updateComment({ data, where: { id }}, info)
  },
  deleteComment(_parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteComment({ where: { id }}, info)
  },
}
