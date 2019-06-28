import jwt from 'jsonwebtoken'

export default ({ request }) => {
  const { authorization } = request.headers

  if (!authorization) {
    throw new Error(`Authentication required.`)
  }

  const token = authorization.split(` `)[1]
  const { userId } = jwt.verify(token , `suchasecret`)

  return userId
}
