`use strict`
module.exports = async () => {
  await global.httpServer.close()
}
