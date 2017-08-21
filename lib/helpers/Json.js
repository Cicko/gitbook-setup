"use strict"
var fs = require('fs-extra');
var Tacks = require('tacks');
var Dir = Tacks.Dir
var File = Tacks.File

class Json {
  static getFromFile (fileName, encoding = 'utf8') {
    if(fs.existsSync(fileName)) {
      var contents = fs.readFileSync(fileName, encoding);
      if (contents)
        return JSON.parse(contents);
    }
    else {
      console.log(fileName + " doesn't exist");
      return {};  // Return empty object if the file does not exist.
    }
  }

  static appendToFile (sourceFile, destFile) {
    var source = Json.getFromFile(sourceFile);
    var dest = Json.getFromFile(destFile);

    var finalMerge = Object.assign(source, dest);

    //console.log(finalMerge);

    fs.writeFileSync(destFile, JSON.stringify(finalMerge, null, "\t"));
  }

  static appendDataToFile (data, attribute, destFile, callback) {
    var destObj = Json.getFromFile(destFile);

    console.log("Content of package.json:");
    console.log(destObj);

    destObj[attribute] = Object.assign(destObj[attribute], data);

    console.log("DATA APPEND TO: ", destFile);
    console.log(destObj);

    var result = destObj;


//    fs.unlink(destFile, function (err) {
      /*var template = new Tacks(Dir({
        'cucoide.json': File(JSON.stringify(result, null, "\t"))}));

      template.create(process.cwd());*/

      fs.writeFile(destFile, JSON.stringify(result, null, "\t"), function(err) {
        if (err) {
          console.log("ERROR HAPPEN")
          return console.log(err);
        }
        callback();
      })


    //});

  }

  /*
  * This function create fileName if not exist and writes JSON content on it.
  *
  */
  /*
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
*/
}
/*
function isArray (object) {
  return Object.prototype.toString.call(object) === '[object Array]';
}
*/

module.exports = Json;
