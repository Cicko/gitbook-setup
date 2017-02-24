"use strict"
var inquirer = require('inquirer')
const BookConfig = require('./BookConfig');

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
        choices: ['Api', 'Book', 'Faq', 'I want to use my own template'],
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
        type: 'input',
        name: 'description',
        message: 'Put some description of your book: ',
      },
      {
        type: 'input',
        name: 'author',
        message: 'Who will be the author?: ',
        default: process.env.USER
      }
    ];
    inquirer.prompt(this.questions).then(function (answers) {
      console.log('\nYour book summary:');
      console.log(JSON.stringify(answers, null, '  '));
      callback(answers);
    });
  }
}

module.exports = GitbookInquirer;
