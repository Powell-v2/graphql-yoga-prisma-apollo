`use strict`
import bcrypt from 'bcryptjs'

export default (password) => {
  if (password.length < 8) {
    throw new Error(`Password must be longer than 7 symbols.`)
  }

  return bcrypt.hash(password, 10)
}
