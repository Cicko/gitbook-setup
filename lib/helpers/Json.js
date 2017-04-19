"use strict"
var fs = require('fs-extra');

class Json {
  static getFromFile (fileName, encoding = 'utf8') {
    if(fs.existsSync(fileName)) {
      var contents = fs.readFileSync(fileName, encoding);
      return JSON.parse(contents);
    }
    return [];  // Return empty array if the file does not exist.
  }

  static addDataToFile (fileName, attribute, content) {
    var fileContent = Json.getFromFile(fileName);

    if (Object.prototype.toString.call(content) === '[object Array]' ) {
      content.forEach(function (val) {
        if (Object.prototype.toString.call(fileContent[attribute]) === '[object Array]')
          fileContent[attribute].push(val);
        else
          fileContent[attribute] = new Array(fileContent[attribute], val);
      });
    }
    else {
      fileContent[attribute].push(content);
    }

    fs.writeFileSync(fileName, JSON.stringify(fileContent, null, "\t"));
  }

}

module.exports = Json;
