

var gitbook_setup = require('./gitbook-setup.js')
var Create = gitbook_setup.Create
var Install = gitbook_setup.Install
var Build = gitbook_setup.Build

var info = {
  name: 'title',
  deploys: ['heroku', 'gh-pages']
}                                                         //, path: '/home/rudy/Escritorio/tfg'}


// BEAUTIFUL

Create(info).then(Install).then(Build).catch(err => console.log(err))




// UGLY

/*
gitbook_setup.create((err) => {
  if (err) console.log(err)
  else {
    gitbook_setup.install((err) => {
      if (err) console.log(err)
      else {
        gitbook_setup.build((err) => {
          if (err) console.log(err)
        })
      }
    })
  }
})
*/
