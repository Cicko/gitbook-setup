"use strict"
var inquirer = require('inquirer')
const BookConfig = require('./BookConfig');

class GitbookInquirer {
  constructor () { }

  static ask () {
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
        choices: ['Api', 'Book', 'Faq'],
        filter: function (val) {
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
      BookConfig.createFile(answers);
      return answers;
    });
  }
}

module.exports = GitbookInquirer;
