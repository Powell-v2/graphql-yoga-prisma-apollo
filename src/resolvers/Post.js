const Post = {
  author: ({ author: authorId }, _args, { db }) => db.users.find(({ id }) => id === authorId),
  comments: ({ id }, _args, { db }) => db.comments.filter(({ post: postId }) => postId === id),
}

export default Post
