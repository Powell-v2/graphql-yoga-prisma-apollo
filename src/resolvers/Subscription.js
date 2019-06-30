`use strict`
import getUserId from '../utils/getUserId'

export default {
  post: {
    subscribe: (_parent, { authorId }, { prisma }, info) =>
      prisma.subscription.post({
        where: {
          node: { author: { id: authorId }}
        }
      }, info)
  },
  comment: {
    subscribe: (_parent, { postId }, { prisma }, info) =>
      prisma.subscription.comment({
        where: {
          node: { post: { id: postId }}
        }
      }, info)
  },
  myPost: {
    subscribe: (_parent, _args, { prisma, request }, info) =>
      prisma.subscription.post({
        where: {
          node: { author: { id: getUserId(request) }}
        }
      }, info)
  },
}
