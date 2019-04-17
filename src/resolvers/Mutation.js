import uuidv4 from 'uuid/v4'

const Mutation = {
  createUser: (_parent, { data }, { db }) => {
    const isUserTaken = db.users.some(({ email }) => email === data.email)

    if (isUserTaken) throw new Error ('Email is already taken.')

    const user = {
      id: uuidv4(),
      ...data,
    }
    db.users.push(user)

    return user
  },
  updateUser: (_parent, args, { db }) => {
    const { id, data } = args
    const user = db.users.find((user) => user.id === id)

    if (!user) throw new Error (`User wasn't found.`)

    if (typeof data.email === 'string') {
      const isEmailTaken = db.users.some(({ email }) => email === data.email)

      if (isEmailTaken) throw new Error(`Email is already taken.`)

      user.email = data.email
    }

    if (typeof data.name === `string`) user.name = data.name
    if (typeof data.age !== `undefined`) user.age = data.age

    return user
  },
  deleteUser: (_parent, args, { db }) => {
    const userIdx = db.users.findIndex((user) => args.id === user.id)

    if (userIdx === -1) throw new Error (`User wasn't found.`)

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id

      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id)
      }

      return !match
    })

    db.comments = db.comments.filter((comment) => comment.author !== args.id)

    return db.users.splice(userIdx, 1)[0]
  },
  createPost: (_parent, args, { db, pubsub }) => {
    const { data } = args
    const userExists = db.users.some(({ id }) => id === data.author)

    if (!userExists) throw new Error (`User wasn't found.`)

    const post = {
      id: uuidv4(),
      ...data,
    }
    db.posts.push(post)

    if (data.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: `CREATED`,
          data: post,
        }
      })
    }

    return post
  },
  updatePost: (_parent, args, { db, pubsub }) => {
    const { id, data } = args
    const post = db.posts.find((post) => post.id === id)
    const origPost = { ...post }

    if (!post) throw new Error (`Post wasn't found.`)

    if (typeof data.title === `string`) post.title = data.title
    if (typeof data.body === `string`) post.body = data.body
    if (typeof data.published === `boolean`) {
      post.published = data.published

      if (origPost.published && !post.published) {
        pubsub.publish(`post`, {
          post: {
            mutation: `DELETED`,
            data: origPost
          }
        })
      }
      else if (!origPost.published && post.published) {
        pubsub.publish(`post`, {
          post: {
            mutation: `CREATED`,
            data: post
          }
        })
      }
    } else if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: `UPDATED`,
          data: post
        }
      })
    }

    return post
  },
  deletePost: (_parent, args, { db, pubsub }) => {
    const postIdx = db.posts.findIndex((post) => args.id === post.id)

    if (postIdx === -1) throw new Error (`Post wasn't found.`)

    db.comments = db.comments.filter((comment) => comment.post !== args.id)

    const [ post ] = db.posts.splice(postIdx, 1)

    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: `DELETED`,
          data: post,
        }
      })
    }

    return post
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
