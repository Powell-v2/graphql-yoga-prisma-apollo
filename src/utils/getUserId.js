`use strict`
import jwt from 'jsonwebtoken'

export default ({ request }, isAuthRequired = true) => {
  const { authorization } = request.headers

  if (authorization) {
    const token = authorization.split(` `)[1]
    const { userId } = jwt.verify(token , `suchasecret`)

    return userId
  }

  if (isAuthRequired) {
    throw new Error(`Authentication required.`)
  }

  return null
}
