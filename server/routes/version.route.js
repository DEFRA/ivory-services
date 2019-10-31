const { name, homepage, version } = require('../../package')
const git = require('git-last-commit')
const path = '/version'

module.exports = [
  {
    method: 'GET',
    path,
    handler: async (request) => {
      const { info: instance } = request.server
      const commit = await new Promise((resolve, reject) => {
        git.getLastCommit((err, commit) => {
          if (err) {
            reject(err)
          } else {
            resolve(commit)
          }
        })
      })
      Object.assign(commit, { name, version, commit: homepage.replace('#readme', `/commit/${commit.hash}`), instance })
      return commit
    },
    options: {
      tags: ['api'],
      security: true
    }
  }]
