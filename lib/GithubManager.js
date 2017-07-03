"use strict"
const GitHubApi = require("github");
const BookConfig = require('./BookConfig.js');
var prompt = require('prompt')
var inquirer = require('inquirer')
var Tacks = require('tacks')
var path = require('path')
const exec = require('child_process').exec;
var fs = require('fs-extra');
var os = require('os')
var Dir = Tacks.Dir
var File = Tacks.File
var github;

var TOKEN = false;
var access_note = 'auth for gitbook-setup on ' + os.hostname() + " " + os.type() + " " + os.platform();

var username;
var password;
var questions;



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
    //console.log("TOKEN IS: " + TOKEN);
  }

  haveToken () {
    return fs.existsSync(path.join(process.env.HOME,'.gitbook-setup','token.json'))? require(path.join(process.env.HOME,'.gitbook-setup','token.json')).token : false;
  }

  authenticate (callback) {
    if (!TOKEN) {
      if (!username && !password) {
        askForAuthentication (function () {
            createAuthorization (function (token) {
              createTokenFile();
              callback();
            });
        });
      }
    }
    else {
      github.authenticate({
        type: 'token',
        token: TOKEN
      });
      callback();
    }
  }

/*
  deleteTokenAccess () {
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
      github.authorization.getAll({}, function (err, out) {
        var exists = false;
        out.data.forEach(function (val,inx) {
          console.log(inx);
          if (val.note == access_note) {
            exists = true;
            github.authorization.delete({
              id: val.id
            }, function(err, out) {
              console.log(out);
            });
          }
          if (inx == out.data.length - 1 && !exists) {
            createAuthorizationWithFile();
          }
        })
      });
    });
  }
  */

    setRemoteRepo () {
      if (TOKEN) {
        askForRemoteRepo(function (answers) {
          if (answers.create_repo == 'No') {
            exec('git remote add origin ' + answers.repo_url, function (err, out) {
              console.log(out);
            })
          }
          else if (answers.create_repo == 'Yes') {
            github.authenticate({
              type: 'oauth',
              token: TOKEN
            });

            github.repos.create({
              'name': answers.repo_name,
              'auto_init': true
            }, function (err,out) {
              console.log(out);
              exec('git remote add origin ' + out.data.clone_url, function (err, out2) {
                console.log(out2);
              })
            });;
          }
        });
      }
      else {
        console.warn("You have to create the token access first");
      }
    }
}


/* This method ask for username and password to return a token through the callback */
function askForAuthentication (callback) {
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
      username = result.username;
      password = result.password;
      github.authenticate({
        type: "basic",
        username: result.username,
        password: result.password
      });
      callback();
    });
  }
  else {
    callback();
  }
}


function askForRemoteRepo (callback) {
  questions = [
    {
      type: 'list',
      name: 'create_repo',
      message: 'Do you want to create a new repo: ',
      choices: ['Yes', 'No'],
      validate: function (value) {
        if (!value) return false;
        return true;
      }
    },
    {
      type: 'input',
      name: 'repo_url',
      message: 'Put the url of that existing github repository: ',
      when: function (answers) {
        return answers.create_repo == 'No'
      }
    },
    {
      type: 'input',
      name: 'repo_name',
      message: 'Put the name of the new github repository: ',
      when: function (answers) {
        return answers.create_repo == 'Yes';
      }
    }
  ];
  inquirer.prompt(questions).then(function (answers) {
    callback(answers);
  });
}

/* This method create the token access after authentication and return the token through the callback */
function createAuthorization (callback) {
  if (!TOKEN) {
    github.authorization.create({
      note: access_note,
      scopes: ['repo','gist','delete_repo']
    }, function(err, res) {
      if (res.data.token) {
        TOKEN = res.data.token;
        console.log(res.data.token + " is the token");
        callback(res.data.token);
      }
    });
  }
  else {
    console.log("ERROR: You are already authenticated.");
  }
}

/* This method checks if a access key exists by the name*/
/*
function checkIfAuthorizationExists (callback) {
  if (!(username && password)) {
    askForAuthentication (function () {
      github.authenticate({
        type: "basic",
        username: '',
        password: ''
      });
      github.authorization.getAll({}, function (err, out) {
        out.data.forEach(function (val, inx) {
          if (val.note == access_note)
          callback(true, val.id);
          if (inx == out.data.length - 1)
          callback(false, val.id);
        });
      });
    });
  }
}
*/

/* This method creates the token access and then create the file with it. */
function createAuthorizationWithFile() {
  createAuthorization (function (token) {
    createTokenFile();
  });
}


/* Create token file */
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
    console.error("ERROR: Token was not initialized.");
  }
}



module.exports = GithubManager;
