'use strict'

const AdalNode = require('adal-node')

const { authorityUrl, clientId, clientSecret, resource } = require('../config')
const LoggingService = require('../services/logging.service')

module.exports = class ActiveDirectoryAuthService {
  getToken () {
    return new Promise((resolve, reject) => {
      // Make the token request

      const AuthenticationContext = AdalNode.AuthenticationContext
      const context = new AuthenticationContext(authorityUrl)

      context.acquireTokenWithClientCredentials(resource, clientId, clientSecret, function (err, tokenResponse) {
        if (err) {
          LoggingService.logError(err.message)
          reject(err)
        } else {
          const token = tokenResponse.accessToken
          if (token) {
            resolve(token)
          } else {
            const error = new Error(`Error obtaining Active Directory auth token: ${JSON.stringify(tokenResponse)}`)
            LoggingService.logError(error.message)
            reject(error)
          }
        }
      })
    })
  }
}
