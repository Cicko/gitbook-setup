#! /usr/bin/env node

(function () {
  var argv = require('minimist')(process.argv.slice(2));
  /*
  var Task = require('shell-task');
  var fs = require('fs');
  var path = require('path');
  var Promise = require('promise');
  var templatesPath = path.join(__dirname, "../", "templates/");
  var githubInterface = require('./github-interface.js').checkArgs(argv);
  var gitbookInteractive = require('./gitbook-interactive.js');
  */

  const GitbookInquirer = require('./GitbookInquirer.js')
  const BookConfig = require('./BookConfig.js')
  const BookCreator = require('./BookCreator.js')

/*
  var Tacks = require('tacks')
  var Dir = Tacks.Dir
  var File = Tacks.File

  var wantedTemplate = {};
  var bookName = argv.n || "NoNameBook";
  var type = argv.t || "book";
*/
  var help = argv.h != null || argv.help != null;

  /**
  * This method load the files into the wantedTemplate object
  * - basePath: is the path where it starts to search the wanted folder specified by the variable type
  * - inSubdirectory: is true when is looking inside the subfolders of the template.
  **/
  /*
  function loadTemplates (basePath, inSubdirectory) {
    var filesInFolder = {};
    fs.readdirSync(basePath).forEach(function(file) {
      if (fs.lstatSync(basePath + file).isDirectory()) {
        var subDirectoryPath = path.join(basePath, file, '/');
        filesInFolder[file] = loadTemplates(subDirectoryPath, true);
      }
      else if (fs.lstatSync(basePath + file).isFile()){
        var filePath = basePath + file;
        fs.readFile(filePath, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          if (!inSubdirectory)
            wantedTemplate[file] = File(data);
          else
            filesInFolder[file] = File(data);
        });
      }
    });
    if (!inSubdirectory) // book folder root
      wantedTemplate = filesInFolder;
    else
      return Dir(filesInFolder);
  }
*/
/*
  function exportTemplate () {
    wantedTemplate['package.json'] = File({
      author: bookInfo.author || process.env.USER,
      name: bookInfo.name || "NoNameBook",
      version: '0.0.1'
    })
    template = new Tacks(Dir(wantedTemplate));
    var exportPath = path.join(process.cwd(), "/" , bookInfo.name);
    template.create(exportPath);
  }
*/
/*
  if (gitbookInteractive.checkArgs(argv)) {
    var bookInfo = gitbookInteractive.createBook();
    bookConfig.createBook(bookInfo);
  }
*/


  if (help || process.argv.length == 2) {
      console.log("Valid commands:");
      console.log("gitbook-setup -n [BOOK NAME] -t [api | book | faq]  --> Create book by args");
      console.log("gitbook-setup --login=github                        --> Login on github");
      console.log("gitbook-setup -i | --interactive                    --> create book in interactive form");
      console.log("gitbook-setup -h | --help                           --> Show available commands");
  }
  else {
    var bookConfig = GitbookInquirer.ask();
    var creator = new BookCreator(bookConfig);
    creator.createBook();
  }
})();
