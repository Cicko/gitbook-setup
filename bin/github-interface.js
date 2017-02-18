(function() {
  var github = require('octonode');
  var prompt = require('prompt');
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
          }
        });
      });
  }


  module.exports = {
    checkAuth: function(auth) {
      if (auth == "github")
        authenticate();
    },
    authenticate: function() {
      authenticate();
    },
    createRepo: function(name) {
      github.repos.create({
        name: name
      });
    },
    getRepo: function(name) {
      github.repos.get({

      });
    }
  };
})()
