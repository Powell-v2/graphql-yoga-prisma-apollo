const users = [
  {
    id: `55`,
    name: `Alessio`,
    email: `alessio@email.org`,
    employed: false,
  },
  {
    id: `44`,
    name: `Josie`,
    email: `josie@email.org`,
    employed: true,
  }
]

const posts = [
  {
    id: `5`,
    title: `What the heck is duck typing?`,
    body: `Ask the ducks!`,
    published: true,
    author: `55`,
  },
  {
    id: `6`,
    title: `What the heck is monkey patching?`,
    body: `Ask the monkeys!`,
    published: true,
    author: `55`,
  },
  {
    id: `3`,
    title: `Rebbbbasse`,
    body: `Use rebase sparingly!`,
    published: false,
    author: `44`,
  }
]

const comments = [
  {
    id: `111`,
    text: `Awesome!`,
    author: `55`,
    post: `6`,
  },
  {
    id: `222`,
    text: `Splendid!`,
    author: `44`,
    post: `5`,
  },
  {
    id: `333`,
    text: `Way to go!`,
    author: `55`,
    post: `3`,
  },
  {
    id: `444`,
    text: `Kickass!`,
    author: `44`,
    post: `6`,
  },
]

const db = {
  users,
  posts,
  comments,
}

export default db
