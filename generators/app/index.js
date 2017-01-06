'use strict';

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');
const mkdirp = require('mkdirp');
const _ = require('lodash');
const extend = _.merge;

const choices = {
  'com': 'Component',
  'lib': 'Library',
  'mod': 'Module',
  'pkg': 'Package',
  'plg': 'Plugin',
  'tpl': 'Template'
};

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option(
      'skip-welcome-message', {
        desc: 'Skips the welcome message',
        type: Boolean,
        default: false
      });

    this.option(
      'skip-install-message', {
        desc: 'Skips the message after the installation of dependencies',
        type: Boolean,
        default: false
      });

    this.option(
      'type', {
        desc: 'Type of Joomla Extension',
        type: String
      });
  };

  initializing() {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('Welcome to the marvellous Joomla! Extensions generator!'));
    }
    this.props = {};
  };

  prompting() {
    const done = this.async();

    const prompts = [{
      type: 'list',
      name: 'type',
      message: 'What type of Joomla! extension do you want to create?',
      choices: (obj) => {
        var choices = [];

        for (var key in obj) {
          choices.push(obj[key]);
        }

        choices.push(new inquirer.Separator(),
          {
            name: 'Get me out here',
            value: null
          })

        return choices;
      },
      when: !this.options['type']
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the extension?',
      default: path.basename(process.cwd()),
      validate: (answer) => {
        if (answer.match(/^(com|lib|mod|pkg|plg|tpl)_/)) {
          return 'Do not write extension prefixes like com_, mod_, etc.';
        }
        else if (!answer.trim()) {
          return false;
        }

        return true;
      },
      when: (answers) => {
        return answers.type
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'What is the extension description?',
      default: 'TODO',
      when: (answers) => {
        return answers.type
      }
    },
    {
      type: 'input',
      name: 'author',
      message: 'Who is the author?:',
      store: true,
      when: (answers) => {
        return answers.type
      }
    },
    {
      type: 'input',
      name: 'authorEmail',
      message: 'Which is the author email?',
      validate: (answer) => {
        if (!answer.match(/([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})/)) {
          return 'Please provide a valid email address';
        }

        return true;
      },
      store: true,
      when: (answers) => {
        return answers.type
      }
    },
    {
      type: 'input',
      name: 'authorUrl',
      message: 'Which is the author website?',
      validate: (answer) => {
        if (answer.length !== 0 && !answer.match(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/)) {
          return 'Please provide a valid URL';
        }

        return true;
      },
      store: true,
      when: (answers) => {
        return answers.type
      }
    },
    {
      type: 'input',
      name: 'languageTag',
      message: 'Which is the default language?',
      default: 'en-GB',
      validate: (answer) => {
        if (!answer.match(/\w{2}-[A-Z]{2}/)) {
          return 'Please provide a valid RFC 3066 language identifier';
        }

        return true;
      },
      when: (answers) => {
        return answers.type
      }
    },
    {
      type: 'input',
      name: 'license',
      message: 'What kind of license do you want to use?',
      default: 'GPLv2',
      store: true,
      when: (answers) => {
        return answers.type
      }
    }
    ];

    return this.prompt(prompts).then(function (answers) {
      this.props = {
        name: answers.name,
        author: answers.author,
        authorEmail: answers.authorEmail,
        authorUrl: answers.authorUrl,
        description: answers.description,
        languageTag: answers.languageTag,
        license: answers.license,
        type: answers.type ? answers.type : this.option.type
      };

      switch (this.props.type) {
        //   case 'com':
        //     this.composeWith('joomla-scaffolder:component', {
        //       options: this.options
        //     });
        //     break;
        //   case 'tpl':
        //     this.composeWith('joomla-scaffolder:template', {
        //       options: this.options
        //     });
        //     break;
      };

      done();
    }.bind(this));
  };

  default() {
    if (!this.props.type) {
      return this.end();
    }

    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        'Your Joomla Extension must be inside a folder named ' + this.props.name + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }

    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );

    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes')
    );

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );
  };

  writing() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        name: this.props.name,
        description: this.props.description,
        homepage: this.props.homepage,
        author: {
          name: this.props.authorName,
          email: this.props.authorEmail,
        },
        keywords: [
          'Joomla',
          choices[this.props.type]
        ],
        license: this.props.license
      }
    );
  };

  end() {
    this.log(yosay('Thank you for using the Joomla! Extensions generator!'));
  }
};
