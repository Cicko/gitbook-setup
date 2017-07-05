"use strict"
const GitHubApi = require("github");
var passport = require('passport');
var fs = require('fs-extra')
var path = require('path')


var github

var TOKEN;

class AuthorizationManager {
  constructor() {
    github = new GitHubApi({
      // optional
      debug: true,
      protocol: "https",
      host: "api.github.com", // should be api.github.com for GitHub
      headers: {
          "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
      },
      Promise: require('bluebird'),
      followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
      timeout: 5000
    });
    TOKEN = fs.existsSync(path.join(process.env.HOME,'.gitbook-setup','token.json'))? require(path.join(process.env.HOME,'.gitbook-setup','token.json')).token : false;
  }

  checkOrg (name, callback) {
    passport.authenticate('github');
    github.authenticate({
      type: 'oauth',
      token: TOKEN
    });

    github.users.getOrgs({}, function(err, orgs) {
      var exists=false;
      orgs.data.forEach(function (org, inx) {
        if (org.login == name) {
          callback(true);
          exists = true;
        }
        else if (inx + 1 == orgs.data.length && !exists) callback(false)
      });
    });
  }
}


module.exports = AuthorizationManager;
