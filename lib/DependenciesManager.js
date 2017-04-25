"use strict"

const FileCreator = require('./helpers/FileCreator.js')

var dependencies = new Array();

class DependenciesManager {
  static createDependenciesFile () {
    FileCreator.create("dependencies.json", dependencies, true, function() {});
  }

  static addDependency (dependency) {
    dependencies.push(dependency);
  }
}

module.exports = DependenciesManager;
