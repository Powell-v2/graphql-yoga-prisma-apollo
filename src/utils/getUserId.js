`use strict`
import jwt from 'jsonwebtoken'

export default ({ request, connection }, isAuthRequired = true) => {
  const authHeader = request
    ? request.headers.authorization
    : connection.context.Authorization

  if (authHeader) {
    const token = authHeader.split(` `)[1]
    const { userId } = jwt.verify(token , `suchasecret`)

    return userId
  }

  if (isAuthRequired) {
    throw new Error(`Authentication required.`)
  }

  return null
}
