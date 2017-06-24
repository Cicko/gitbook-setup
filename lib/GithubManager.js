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


var TOKEN = false;

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
    TOKEN = fs.existsSync(path.join(process.env.HOME,'.gitbook-setup','token.json'))? require(path.join(process.env.HOME,'.gitbook-setup','token.json')).token : false;
    console.log("TOKEN IS:");
    console.log(TOKEN);
  }

  haveToken () {
    return fs.existsSync(path.join(process.env.HOME,'.gitbook-setup','token.json'))? require(path.join(process.env.HOME,'.gitbook-setup','token.json')).token : false;
  }

  authenticate (callback) {
    if (!TOKEN) {
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
        createAuthorization (function (token) {
          TOKEN = token;
          createTokenFile();
          if (callback) callback();
        });
      });
    }
    else {
      callback();
    }
    /*
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
    */
    }



    createRepo (name) {
      if (TOKEN) {
        github.authenticate({
          type: 'oauth',
          token: TOKEN
        });
        github.repos.create({
          'name': name
        });
      }
    }
}

function createTokenFile () {
  if (TOKEN) {
    var tokenFile = new Tacks(Dir({
      'token.json': File({
        "token": TOKEN
      })
    }));
    var exportPath = path.join(process.env.HOME,'.gitbook-setup');
    tokenFile.create(exportPath);
  }
  else {
    console.error("ERROR: Token was not initialized");
  }
}

function createAuthorization (callback) {
  github.authorization.create({
      note: "auth for gitbook-setup",
      scopes: ['repo','gist','delete_repo']
  }, function(err, res) {
      if (res.data.token) {
        console.log(res.data.token + " is the token");
        callback(res.data.token);
      }
    });
}

module.exports = GithubManager;
