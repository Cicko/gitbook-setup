"use strict"
const GitHubApi = require("github");
var prompt = require('prompt');
var github;

class GithubManager {
  constructor () {
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
    console.log(this.github);
  }

  authenticate () {
    prompt.get([{
      name: 'username',
      required: true
    }, {
      name: 'password',
      hidden: true,
      conform: function (value) {
        return true;
      }
    }], function (err, result) {
      github.authenticate({
          type: "basic",
          username: result.username,
          password: result.password
      });
      github.authorization.create({
          note: "auth for gitbook-setup"
      }, function(err, res) {
          if (res.data.token) {
            console.log(res.data.token + " is the token");
              //save and use res.token as in the Oauth process above from now on
          }
        });
      });
    }
}

module.exports = GithubManager;
