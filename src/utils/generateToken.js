`use strict`
import jwt from 'jsonwebtoken'

export default (user) =>
  jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: `30 days` })
