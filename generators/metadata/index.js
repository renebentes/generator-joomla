'use strict';

var yeoman   = require('yeoman-generator');
var yosay    = require('yosay');
var chalk    = require('chalk');
var inquirer = require('inquirer');
var path     = require('path');

var JoomlaMetadataGenerator = yeoman.Base.extend({
  constructor: function () {
		yeoman.Base.apply(this, arguments);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });
	},

  initializing: function () {
    if (!this.options['skip-welcome-message']) {
		  this.log(yosay('Welcome to the marvellous Joomla! Extensions generator!'));
    }
	},

  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'text',
      name: 'name',
      message: 'What is the name of the extension?',
      default: path.basename(process.cwd()),
      validate: function (answer) {
        if (answer.match(/^(com|lib|mod|pkg|plg|tpl)_/)) {
          return 'Do not write extension prefixes like com_, mod_, etc.';
        }
        else if (!answer.trim()) {
          return false;
        }

        return true;
      }
    },
    {
      type: 'text',
      name: 'description',
      message: 'What is the extension description?',
      default: 'TODO'
    },
    {
      type: 'text',
      name: 'author',
      message: 'Who is the author?:',
      store: true
    },
    {
      type: 'text',
      name: 'authorEmail',
      message: 'Which is the author email?',
      validate: function (answer) {
        if (!answer.match(/([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})/)) {
          return 'Please provide a valid email address';
        }

        return true;
      },
      store: true
    },
    {
      type: 'text',
      name: 'authorUrl',
      message: 'Which is the author website?',
      validate: function (answer) {
        if (answer.length !== 0 && !answer.match(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/)) {
          return 'Please provide a valid URL';
        }

        return true;
      },
      store: true
    },
    {
      type: 'text',
      name: 'languageTag',
      message: 'Which is the default language?',
      default: 'en-GB',
      validate: function (answer) {
        if (!answer.match(/\w{2}-[A-Z]{2}/)) {
          return 'Please provide a valid RFC 3066 language identifier';
        }

        return true;
      }
    },
    {
      type: 'text',
      name: 'license',
      message: 'What kind of license do you want to use?',
      default: 'GPLv2',
      store: true
    }];

    return this.prompt(prompts).then(function (answers) {
      this.data = {
        author: answers.author,
        authorEmail: answers.authorEmail,
        authorUrl: answers.authorUrl,
        description: answers.description,
        languageTag: answers.languageTag,
        license: answers.license
      };

      done();
    }.bind(this))
  }
});

module.exports = JoomlaMetadataGenerator;
