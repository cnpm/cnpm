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
var debug = require('debug')('cnpm:origin');
var match = require('auto-correct');
var spawn = require('cross-spawn');
var fs = require('fs');
var path = require('path');
var config = require('./config');
var parseArgv = require('./parse_argv');

var program = parseArgv();

var args = program.rawArgs.slice(2);

for (var i = 0; i < args.length; i++) {
  if (args[i][0] !== '-') {
    args[i] = correct(args[i]);
  }
}

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

var nodeModulesDir = path.join(__dirname, 'node_modules', '.bin');
var cmd = 'npm';
cmd = path.join(nodeModulesDir, cmd);

// if npm-beta not exists, use npm. happen on `$ cnpm install cnpm`
if (!fs.existsSync(cmd)) {
  cmd = 'npm';
}

debug('%s %s', cmd, args.join(' '));

var env = {
  NVM_NODEJS_ORG_MIRROR: config.disturl,
  PHANTOMJS_CDNURL: config.disturl + '/phantomjs',
  // set npm config: always-auth be true
  // NPM_CONFIG_ALWAYS_AUTH: 'true',
};

for (var k in process.env) {
  env[k] = process.env[k];
}

var npm  = spawn(cmd, args, {
  env: env,
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

/**
 * correct command
 * @return {[type]} [description]
 */
function correct(command) {
  var cmds = [
    'install',
    'publish',
    'adduser',
    'author',
    'config',
    'unpublish',
  ];
  for (var i = 0; i < cmds.length; i++) {
    if (match(command, cmds[i])) {
      return cmds[i];
    }
  }
  return command;
}
