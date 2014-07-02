/**!
 * cnpm - test/cnpm.test.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var spawn = require('cross-spawn');
var should = require('should');
var path = require('path');
var fse = require('fs-extra');
var cnpm = path.join(__dirname, '..', 'bin', 'cnpm');

describe('cnpm.test.js', function () {
  it('should install padding', function (done) {
    var args = [
      cnpm,
      'install',
      'pedding',
      '--registry=https://registry.npm.taobao.org',
      '--verbose'
    ];
    var child = spawn('node', args).on('exit', function (code) {
      code.should.equal(0);
      done();
    });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stdout);
  });
});
