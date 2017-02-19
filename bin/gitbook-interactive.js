
(function () {
  var inquirer = require('inquirer')

  module.exports.createBook = function () {
    var questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Put the name of your book: ',
        validate: function (value) {
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

    inquirer.prompt(questions).then(function (answers) {
      console.log('\nYour book summary:');
      console.log(JSON.stringify(answers, null, '  '));
      return answers;
    });
  }

  module.exports.checkArgs = function (args) {
    return (args.i || args.interactive);
  }



})();
