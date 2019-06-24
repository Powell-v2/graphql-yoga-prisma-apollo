export default {
  post: {
    subscribe: (_parent, { authorId }, { prisma }, info) => {
      return prisma.subscription.post({
        where: {
          node: {
            author: {
              id: authorId
            }
          }
        }
      }, info)
    }
  },
  comment: {
    subscribe(_parent, { postId }, { prisma }, info) {
      return prisma.subscription.comment({
        where: {
          node: {
            post: {
              id: postId
            }
          }
        }
      }, info)
    }
  },
}
