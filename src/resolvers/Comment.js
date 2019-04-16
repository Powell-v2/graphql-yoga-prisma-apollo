const Comment = {
  author: ({ author }, _args, { db }) => db.users.find(({ id }) => id === author),
  post: ({ post: postId }, _args, { db }) => db.posts.find(({ id }) => id === postId),
}

export default Comment
