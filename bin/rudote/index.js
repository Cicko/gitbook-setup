const exec = require('child_process').exec;
var fs = require('fs-extra');


var contents = fs.readFileSync(".config.book.json", "utf-8");
contents = JSON.parse(contents);
var bookName = contents.name;



exec("ls .git", function (err, out, code) {
  if (out == ""){ // NO GIT REPOSITORY
    exec('git init');ha
  }
  exec("heroku apps", function (err, out, code) {
    if (err) console.log(err);
    else {
      if (!out.includes(bookName + "-" + process.env.USER)) {
        console.log("app " + bookName + "-" + process.env.USER + " doesn't exist");
        exec("heroku create " + bookName.toLowerCase() + "-" + process.env.USER , function (err, out, code) {
          if (err) console.log(err);
          console.log("Created app: " + out);
          heroku_url = "https://" + bookName + "-" + process.env.USER + ".herokuapp.com/"
          exec("git remote add heroku " + heroku_url);
          exec("gitbook build", function (err, out, code) {
            if (err) console.log(err);
            exec("git add _book")
            exec("git commit -m 'Creating book'")
          });
        });
      }
    }
  });
});