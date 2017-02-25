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
              createRepo();
            }
          });
        });
  }


  function createRepo () {
    prompt.get([{
      name: 'name',
      required: true
    }, {
      name: 'description',
      required: false
    }], function (err, result) {
      if (!err) {
        ghme.repo({
            "name": result.name,
            "description": result.description,
          }, function (err2) {
            if (err) {
              console.log("Error happen: " + err2);
            }
          });
      }
      else {
        console.log("Error happen: " + err);
      }
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
