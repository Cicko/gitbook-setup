"use strict"
var fs = require('fs');

class Json {
  static getFromFile (fileName, encoding = 'utf8') {
    var contents = fs.readFileSync(fileName, encoding);
    return JSON.parse(contents);
  }
}

module.exports = Json;
