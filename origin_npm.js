/**!
 * cnpm - origin_npm.js
 *
 * Copyright(c) cnpmjs.org and other contributors.
 * MIT Licensed
 *
 * Authors:
 *  fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 *  dead_horse <dead_horse@qq.com> (http://deadhorse.me)
 */

'use strict';

/**
 * Module dependencies.
 */

require('colors');
var debug = require('debug')('cnpm');
var spawn = require('child_process').spawn;
var fs = require('fs');
var config = require('./config');
var parseArgv = require('./parse_argv');

var program = parseArgv();

var args = program.rawArgs.slice(2);

var CWD = process.cwd();

if (program.userconfig && !fs.existsSync(program.userconfig)) {
  // make sure userconfig exists
  // or it will throw: npm ERR! Error: default value must be string or number
  fs.writeFileSync(program.userconfig, 'email =\n');
}

args.unshift('--registry=' + program.registry);
args.unshift('--cache=' + program.cache);
args.unshift('--disturl=' + program.disturl);
args.unshift('--userconfig=' + program.userconfig);

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
