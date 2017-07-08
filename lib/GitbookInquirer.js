
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
        name: 'template',
        message: 'What template do you want to use?',
        choices: ['Book', 'Api', 'Faq', 'I want to use other template'],
        filter: function (val) {
          if (val == 'I want to use other template') val = 'own';
          return val.toLowerCase();
        }
      },
      {
        type: 'input',
        name: 'programming language',
        message: 'What will be the main programming language? ',
        when: function (answers) {
          return answers.template == 'api';
        }
      },
      {
        type: 'input',
        name: 'template',
        message: 'Indicate your template name (have to be npm module): ',
        when: function (answers) {
          return answers.template == 'own';
        }
      },
      {
        type: 'checkbox',
        name: 'deploys',
        message: 'Select where you would like to deploy your book:',
        choices: ['gh-pages', 'heroku', 'others'],
      },
      {
        type: 'input',
        name: 'deployServers',
        message: 'Indicate your deploy server name (node module, url or ip). You can indicate more than one separating by commas: ',
        when: function (answers) {
          return answers.deploys.includes('others');
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
      },
      {
        type: 'list',
        name: 'private',
        message: 'Will be private this document? (default: NO): ',
        choices: ['yes','no'],
        default: 'no'
      },
      {
        type: 'input',
        name: 'organization',
        message: 'What Github organization will have access to that document?: ',
        when: function(answers) {
          return answers.private.includes('yes');
        }
      }
    ];
    inquirer.prompt(this.questions).then(function (answers) {
      if (answers.deploys.includes("others")) {
        var i = answers.deploys.indexOf("others");
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
