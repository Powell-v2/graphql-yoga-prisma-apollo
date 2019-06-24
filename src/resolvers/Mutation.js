import uuidv4 from 'uuid/v4'

const Mutation = {
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
  updatePost: (_parent, args, { prisma }, info) => {
    const { id, data } = args

    return prisma.mutation.updatePost({ data, where: { id }}, info)
  },
  deletePost: (_parent, { id }, { prisma }, info) => {
    return prisma.mutation.deletePost({ where: { id }}, info)
  },
  createComment: (_parent, { data }, { db, pubsub }) => {
    const userExists = db.users.some(({ id }) => id === data.author)
    const postExists = db.posts.some(({ id }) => id === data.post)

    if (!userExists) throw new Error (`User wasn't found.`)
    if (!postExists) throw new Error (`Post wasn't found.`)

    const comment = {
      id: uuidv4(),
      ...data,
    }
    db.comments.push(comment)

    pubsub.publish(`comment_on_post_${data.post}`, {
      comment: {
        mutation: `CREATED`,
        data: comment,
      }
    })

    return comment
  },
  updateComment: (_parent, args, { db, pubsub }) => {
    const { commentId, data } = args
    const comment = db.comments.find(({ id }) => id === commentId)

    if (!comment) throw new Error (`Comment wasn't found.`)

    if (typeof data.text === `string`) comment.text = data.text

    pubsub.publish(`comment_on_post_${comment.post}`, {
      comment: {
        mutation: `UPDATED`,
        data: comment,
      }
    })

    return comment
  },
  deleteComment: (_parent, args, { db, pubsub }) => {
    const { commentId } = args
    const commentIdx = db.comments.findIndex(({ id }) => id === commentId)

    if (commentIdx === -1) throw new Error (`Comment wasn't found.`)

    const [ comment ] = db.comments.splice(commentIdx, 1)

    pubsub.publish(`comment_on_post_${comment.post}`, {
      comment: {
        mutation: `DELETED`,
        data: comment,
      }
    })

    return comment
  },
}

export default Mutation
