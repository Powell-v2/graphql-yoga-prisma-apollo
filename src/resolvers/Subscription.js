const Subscription = {
  comment: {
    subscribe: (_parent, args, { db, pubsub }) => {
      const { postId } = args
      const post = db.posts.find(({ id, published }) => id === postId && published)

      if (!post) throw new Error(`Post wasn't found`)

      return pubsub.asyncIterator(`new_comment_on_post_${postId}`)
    }
  },
  post: {
    subscribe: (_parent, _args, { pubsub }) => {
      return pubsub.asyncIterator(`post`)
    }
  },
}

export default Subscription