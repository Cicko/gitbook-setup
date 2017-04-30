"use strict"
var fs = require('fs-extra');

class Json {
  static getFromFile (fileName, encoding = 'utf8') {
    if(fs.existsSync(fileName)) {
      var contents = fs.readFileSync(fileName, encoding);
      if (contents)
        return JSON.parse(contents);
    }
    return {};  // Return empty array if the file does not exist.
  }

  static appendToFile (sourceFile, destFile) {
    var source = Json.getFromFile(sourceFile);
    var dest = Json.getFromFile(destFile);
    console.log("SOURCE: ");
    console.log(source);
    console.log("DEST: ");
    console.log(dest);
    for (var element in source) {
      Json.addDataToFile(destFile, element, source[element])
    }
  }

  /*
  * This function create fileName if not exist and writes JSON content on it.
  *
  */
  static addDataToFile (fileName, attribute, content) {
    var fileContent = new Object;
    if (fs.existsSync(fileName)) {
      fileContent = Json.getFromFile(fileName);
    }

    if (isArray(content)) {
      content.forEach(function (val) {
        if (isArray(fileContent[attribute]))
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

function isArray (object) {
  return Object.prototype.toString.call(object) === '[object Array]';
}

module.exports = Json;
