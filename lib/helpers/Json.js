"use strict"
var fs = require('fs');

class Json {
  static getFromFile (fileName, encoding = 'utf8') {
    if(fs.existsSync(fileName)) {
      var contents = fs.readFileSync(fileName, encoding);
      return JSON.parse(contents);
    }
    return [];  // Return empty array if the fileName
  }
}

module.exports = Json;
