"use strict"

var passport = require('passport');


class AuthorizationManager {
  static loginWithGithub () {
    passport.authenticate('github');
  }
}


module.exports = AuthorizationManager;
