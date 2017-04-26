"use strict"
var inquirer = require('inquirer')
const BookConfig = require('./BookConfig');
const DependenciesManager = require('./DependenciesManager.js')

class GitbookInquirer {
  constructor () { }
  static ask (callback) {
    this.questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Put the name of your book: ',
        validate: function (value) {
          if (!value) return false;
          return true;
        }
      },
      {
        type: 'list',
        name: 'type',
        message: 'What type of book you want to create?',
        choices: ['Book', 'Api', 'Faq', 'I want to use my own template'],
        filter: function (val) {
          if (val == 'I want to use my own template') val = 'own';
          return val.toLowerCase();
        }
      },
      {
        type: 'input',
        name: 'programming language',
        message: 'What will be the main programming language? ',
        when: function (answers) {
          return answers.type == 'api';
        }
      },
      {
        type: 'input',
        name: 'templateName',
        message: 'Indicate your template name (npm module name): ',
        when: function (answers) {
          return answers.type == 'own';
        }
      },
      {
        type: 'checkbox',
        name: 'deploys',
        message: 'Select where you would like to deploy your book:',
        choices: ['gh-pages', 'heroku', 'own'],
      },
      {
        type: 'input',
        name: 'deployServers',
        message: 'Indicate your deploy server name (whole url). You can indicate more than one separating by commas: ',
        when: function (answers) {
          return answers.deploys.includes('own');
        },
        filter: function (val) {
          return val.split(',');
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Put some description of your book: ',
      },
      {
        type: 'input',
        name: 'authors',
        message: 'Who will be the author\\s (separated by commas)?: ',
        default: process.env.USER,
        filter: function(val) {
          return val.split(",");
        }
      }
    ];
    inquirer.prompt(this.questions).then(function (answers) {
      if (answers.deploys.includes("own")) {
        var i = answers.deploys.indexOf("own");
        if(i != -1) {
	         answers.deploys.splice(i, 1);
        }

        answers.deployServers.forEach(function (element) {
          answers.deploys.push(element);
        });
        delete answers.deployServers;
      }


      console.log('\nYour book summary:');
      console.log(JSON.stringify(answers, null, '  '));
      callback(answers);
    });
  }
}



module.exports = GitbookInquirer;
