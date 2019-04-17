const Subscription = {
  comment: {
    subscribe: (_parent, args, { db, pubsub }) => {
      const { postId } = args
      const post = db.posts.find(({ id, published }) => id === postId && published)

      if (!post) throw new Error(`Post wasn't found`)

      return pubsub.asyncIterator(`post_${postId}`)
    }
  }
}

export default Subscription
