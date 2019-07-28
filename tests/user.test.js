import 'cross-fetch/polyfill'
import ApolloBoost, { gql } from 'apollo-boost'

import prisma from '../src/prisma'

const client = new ApolloBoost({ uri: `http://localhost:4000/ `})

it(`should create a new user`, async () => {
  expect.assertions(1)
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Jess"
          email: "a@b.c"
          password: "01234567"
        }
      ) {
        token
        user {
          id
        }
      }
    }
  `

  const { data } = await client.mutate({ mutation: createUser })
  const exists = await prisma.exists.User({
    id: data.createUser.user.id
  })

  expect(exists).toBe(true)
})
