'use strict';

const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const os = require('os');

describe('generator-joomla:app', () => {
  before(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        name: 'simple',
        author: 'Rene B. Pinto',
        authorEmail: 'renebentes@yahoo.com.br',
        authorUrl: 'http://github.com/renebentes',
        description: 'Simple Test',
        languageTag: 'en-GB',
        license: 'GPLv2'
      })
      .toPromise();
  });

  it('created and CD into a folder named \'simple\'', () => {
    assert.equal(path.basename(process.cwd()), 'simple');
  });

  it('creates expected files', () => {
    assert.file([
      '.editorconfig',
      '.gitignore',
      '.gitattributes',
      'package.json',
      'README.md',
      'LICENSE'
    ]);
  });
});
