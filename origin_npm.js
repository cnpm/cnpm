/**!
 * cnpm - origin_npm.js
 *
 * Copyright(c) cnpmjs.org and other contributors.
 * MIT Licensed
 *
 * Authors:
 *  fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

require('colors');
var debug = require('debug')('cnpm');
var spawn = require('child_process').spawn;
var config = require('./config');
var parseArgv = require('./parse_argv');

var program = parseArgv();

var args = process.argv.slice(2);

var CWD = process.cwd();

args.unshift('--registry=' + program.registry);
args.unshift('--cache=' + config.cache);
var cmd = 'npm';
if (process.platform === "win32") {
  cmd = 'npm.cmd';
}
debug('%s %s', cmd, args.join(' '));

var npm  = spawn(cmd, args, {
  env: process.env,
  cwd: CWD,
  stdio: [
    process.stdin,
    process.stdout,
    process.stderr,
  ]
});

npm.on('exit', function (code, signal) {
  process.exit(code);
});
