(function() {
  var github = require('octonode');
  var ghme;
  var prompt = require('prompt');
  var authenticated = false;
  var client;

  function authenticate () {
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
        client = github.client({
          username: result.username,
          password: result.password
        });
        client.get('/user', {}, function (err, status, body, headers) {
          if (err) {
            console.log("Error happend authenticating user: " + err);
            authenticate();
          }
          else {
            console.log("user authenticated correctly")
            authenticated = true;
            console.log(body);
            ghme = client.me();
            createRepo("sampleRepo");
          }
        });
      });
  }


  function createRepo () {
    prompt.get([{
      name: 'repo name',
      required: true
    }, {
      name: 'description',
      required: false
    }], function (err, result) {
      ghme.repo({
          "name": result.name,
          "description": result.description,
      }, function (err) {
        if (err) {
          console.log("Error happen: " + err);
        }
      });
    });
  }


  module.exports = {
    checkArgs: function(auth) {
      if (auth.login == "github") {
        authenticate();
      }
    },
    authenticate: function() {
      authenticate();
    },
    createRepo: function(name) {
      if (authenticated) {
        createRepo(name);
      }
      else {
        authenticate();
      }

    },
    getRepo: function(name) {
      github.repos.get({

      });
    }
  };
})()
