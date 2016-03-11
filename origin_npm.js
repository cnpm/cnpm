/**
 * Copyright(c) cnpm and other contributors.
 * MIT Licensed
 *
 * Authors:
 *  fengmk2 <fengmk2@gmail.com> (http://fengmk2.com)
 *  dead_horse <dead_horse@qq.com> (http://deadhorse.me)
 */

'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('cnpm:origin');
var match = require('auto-correct');
var spawn = require('cross-spawn');
var fs = require('fs');
var path = require('path');
var config = require('./config');
var parseArgv = require('./parse_argv');

var program = parseArgv();

var rawArgs = program.rawArgs.slice(2);
var args = [];
var hasCNPM = false;
var isInstall = false;
for (var i = 0; i < rawArgs.length; i++) {
  var arg = rawArgs[i];
  if (arg[0] !== '-') {
    arg = correct(arg);
    if (arg === 'cnpm') {
      hasCNPM = true;
    }
  }
  if (i === 0 && (arg === 'i' || arg === 'install')) {
    isInstall = true;
    continue;
  }
  args.push(arg);
}

var CWD = process.cwd();

if (program.userconfig && !fs.existsSync(program.userconfig)) {
  // make sure userconfig exists
  // or it will throw: npm ERR! Error: default value must be string or number
  fs.writeFileSync(program.userconfig, 'email =\n');
}

args.unshift('--registry=' + program.registry);
if (program.disturl) {
  args.unshift('--disturl=' + program.disturl);
}
if (program.userconfig) {
  args.unshift('--userconfig=' + program.userconfig);
}
if (program.proxy) {
  args.unshift('--proxy=' + program.proxy);
}

var npmBin;

if (isInstall) {
  // if local npm not exists, use npm. happen on `$ cnpm install cnpm`
  if (hasCNPM) {
    npmBin = path.join(path.dirname(process.execPath), 'npm');
    args.unshift('install');
  } else {
    npmBin = path.join(__dirname, 'node_modules', '.bin', 'npminstall');
    args.unshift('--china');
  }
} else {
  npmBin = path.join(__dirname, 'node_modules', '.bin', 'npm');
}

debug('%s %s', npmBin, args.join(' '));

var env = {};
for (var k in process.env) {
  env[k] = process.env[k];
}

var npm  = spawn(npmBin, args, {
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
