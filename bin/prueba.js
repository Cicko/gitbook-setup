

var gitbook_setup = require('./gitbook-setup.js')

var info = {name: 'title'}//, path: '/home/rudy/Escritorio/tfg'}


function create(info) {
  return new Promise ((resolve, reject) => {
    gitbook_setup.create(info, (err, msg) => {
      if (err) reject("ERR: " + err)
      else {
        resolve(info.name)
      }
    })
  })
}


function install (title){
  var path = title? require('path').join(process.cwd(), title) : process.cwd()
  require('shelljs').cd(path);
  console.log("Actual path: " + process.cwd())
  return new Promise ((resolve, reject) => {
    gitbook_setup.install((err, msg) => {
      if (err) reject("ERR: " + err)
      else if (msg) console.log(msg)
      else resolve("Document correctly installed");
    })
  })
}



create(info)
.then((title) => install(title))
.then(msg => console.log(msg))
.catch(err => console.log(err))
