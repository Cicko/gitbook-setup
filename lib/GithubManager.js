"use strict"
const GitHubApi = require("github");
const BookConfig = require('./BookConfig.js');
var prompt = require('prompt')
var Tacks = require('tacks')
var path = require('path')
var fs = require('fs-extra');
var Dir = Tacks.Dir
var File = Tacks.File
var github;


var TOKEN = fs.existsSync(path.join(process.env.HOME,'.gitbook-setup','.token.json'))? require(path.join(process.env.HOME,'.token.json')).token : false;

var tk;

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
    console.log(TOKEN);
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
      github.authorization.getAll({}, function (err, val) {
        if (err) {

          console.error(err)
        }
        else {
          console.log("AUTHORIZATIOSN");
          console.log(val);
        }
      });
      if (tk) {
        github.authorization.check({
          'access_token': tk? tk : 'no_token'
        },function (err, res) {
          if (err) {
            console.log(err);
          }
          else {
            console.log("RESULT OF AUTHORIZATION.CHECK");
            console.log(res);
          }
        });
      }
      else {
        createAuthorization (function () {
          callback();
        })
      }
    });
    }

    createTokenFile (token) {
      tk = token;
      if (token) {
        var tokenFile = new Tacks(Dir({
          'token.json': File({
            "token": tk
          })
        }));
        var exportPath = path.join(process.cwd());
        tokenFile.create(exportPath);
      }
      else {
        console.error("ERROR: Token was not initialized");
      }
    }

    createRepo (name) {
        github.authenticate({
          type: 'oauth',
          token: '1d94489bcf8d9d80339c43dfa13a8b20649ebf59'
        });
        github.repos.create({
          'name': name
        });
    }
}

function createAuthorization (callback) {
  github.authorization.create({
      note: "auth for gitbook-setup"
  }, function(err, res) {
      if (res.data.token) {
        console.log(res.data.token + " is the token");
        callback(res.data.token);
      }
    });
}

module.exports = GithubManager;
