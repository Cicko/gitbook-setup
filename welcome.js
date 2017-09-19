#!/usr/bin/env node
var opn = require('opn')

opn("https://cicko.github.io/gitbook-setup/")
   .then ((val) => {
	console.log("Showing details about usability " + val)
  })
   .catch ((err) => {
       console.log("ERROR " + err)
   })

