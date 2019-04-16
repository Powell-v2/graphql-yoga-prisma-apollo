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
