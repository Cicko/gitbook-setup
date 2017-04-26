"use strict"
const GitHubApi = require("github");
const BookConfig = require('./BookConfig.js');
var prompt = require('prompt')
var Tacks = require('tacks')
var path = require('path')
var Dir = Tacks.Dir
var File = Tacks.File
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
  }

  authenticate (callback) {
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
            callback(res.data.token);
          }
        });
      });
    }

    createTokenFile (token) {
      if (token) {
        var tokenFile = new Tacks(Dir({
          'token.json': File({
            "token": token
          })
        }));
        var exportPath = path.join(process.cwd(), "/" , BookConfig.getBookConfig().name);
        tokenFile.create(exportPath);
      }
      else {
        console.error("ERROR: Token was not initialized");
      }
    }
}

module.exports = GithubManager;
