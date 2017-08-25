"use strict"

const FileCreator = require('./helpers/FileCreator.js')

var dependencies = new Object();

class DependenciesManager {
  static createDependenciesFile (callback) {
    FileCreator.create("dependencies.json", dependencies, true, function() {
      callback();
    });
  }

  static addDependency (dependency) {
    //dependencies.push(dependency);
    dependencies[dependency] = "*"
  }
}

module.exports = DependenciesManager;
