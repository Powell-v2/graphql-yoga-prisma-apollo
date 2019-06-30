`use strict`
import jwt from 'jsonwebtoken'

export default (user) =>
  jwt.sign({ userId: user.id }, `suchasecret`, { expiresIn: `30 days` })
