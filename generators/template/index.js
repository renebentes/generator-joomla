'use strict';

var yeoman = require('yeoman-generator');
var yosay  = require('yosay');
var chalk  = require('chalk');

var JoomlaTemplateGenerator = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });
  },

  initializing: function () {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('Welcome to the marvellous Joomla! Template generator!'));
    }

    this.data = this.options.data ? this.options.data : {};
  },

  prompting: function () {
    this.composeWith('joomla-scaffolder:metadata', {
      options: this.options
    });
  }
});

module.exports = JoomlaTemplateGenerator;
