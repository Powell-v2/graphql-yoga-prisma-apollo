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

    posts = db.posts.filter((post) => {
      const match = post.author === args.id

      if (match) {
        comments = db.comments.filter((comment) => comment.post !== post.id)
      }

      return !match
    })

    comments = db.comments.filter((comment) => comment.author !== args.id)

    return db.users.splice(userIdx, 1)[0]
  },
  createPost: (_parent, { data }, { db }) => {
    const userExists = db.users.some(({ id }) => id === data.author)

    if (!userExists) throw new Error (`User wasn't found.`)

    const post = {
      id: uuidv4(),
      ...data,
    }
    db.posts.push(post)

    return post
  },
  updatePost: (_parent, args, { db }) => {
    const { id, data } = args
    const post = db.posts.find((post) => post.id === id)

    if (!post) throw new Error (`Post wasn't found.`)

    if (typeof data.title === `string`) post.title = data.title
    if (typeof data.body === `string`) post.body = data.body
    if (typeof data.published === `boolean`) post.published = data.published

    return post
  },
  deletePost: (_parent, args, { db }) => {
    const postIdx = db.posts.findIndex((post) => args.id === post.id)

    if (postIdx === -1) throw new Error (`Post wasn't found.`)

    comments = db.comments.filter((comment) => comment.post !== args.id)

    return db.posts.splice(postIdx, 1)[0]
  },
  createComment: (_parent, { data }, { db }) => {
    const userExists = db.users.some(({ id }) => id === data.author)
    const postExists = db.posts.some(({ id }) => id === data.post)

    if (!userExists) throw new Error (`User wasn't found.`)
    if (!postExists) throw new Error (`Post wasn't found.`)

    const comment = {
      id: uuidv4(),
      ...data,
    }
    db.comments.push(comment)

    return comment
  },
  deleteComment: (_parent, args, { db }) => {
    const commentIdx = db.comments.findIndex((comment) => args.id === comment.id)

    if (commentIdx === -1) throw new Error (`Comment wasn't found.`)

    return db.comments.splice(commentIdx, 1)[0]
  },
}

export default Mutation
