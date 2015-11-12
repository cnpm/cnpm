/**!
 * Copyright(c) cnpmjs.org and other contributors.
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

require('colors');
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
for (var i = 0; i < rawArgs.length; i++) {
  var arg = rawArgs[i];
  if (arg[0] !== '-') {
    arg = correct(arg);
    if (arg === 'cnpm') {
      hasCNPM = true;
    }
  }
  args.push(arg);
}

var CWD = process.cwd();

if (program.userconfig && !fs.existsSync(program.userconfig)) {
  // make sure userconfig exists
  // or it will throw: npm ERR! Error: default value must be string or number
  fs.writeFileSync(program.userconfig, 'email =\n');
}

var nodeModulesDir = path.join(__dirname, 'node_modules');
var nodegyp = path.join(nodeModulesDir, 'node-gyp', 'bin', 'node-gyp.js');

args.unshift('--node-gyp=' + nodegyp);
args.unshift('--registry=' + program.registry);
args.unshift('--cache=' + program.cache);
if (program.disturl) {
  args.unshift('--disturl=' + program.disturl);
}
if (program.userconfig) {
  args.unshift('--userconfig=' + program.userconfig);
}
if (program.proxy) {
  args.unshift('--proxy=' + program.proxy);
}

var originalNpmBin = path.join(path.dirname(process.execPath), 'npm');

// node-pre-gyp will try to resolve node_modules/npm, so rename it
// see https://github.com/mapbox/node-pre-gyp/issues/144
function findNpmBin() {
  var npmBin;
  try {
    npmBin = require.resolve('npm');
    // $HOME/git/smart-npm/node_modules/npm/lib/npm.js
    npmBin = path.join(npmBin, '..', '..', '..', '.bin', 'npm');
  } catch (_) {
    npmBin = originalNpmBin;
  }
  return npmBin;
}

var npmBin = findNpmBin();

// if local npm not exists, use npm. happen on `$ cnpm install cnpm`
if (hasCNPM) {
  npmBin = originalNpmBin;
}

debug('%s %s', npmBin, args.join(' '));

var env = {
  NVM_NODEJS_ORG_MIRROR: config.mirrorsUrl + '/node',
  NVM_IOJS_ORG_MIRROR: config.mirrorsUrl + '/iojs',
  PHANTOMJS_CDNURL: config.mirrorsUrl + '/phantomjs',
  CHROMEDRIVER_CDNURL: 'http://oss.npm.taobao.org/dist/chromedriver',
  SELENIUM_CDNURL: config.mirrorsUrl + '/selenium',
  ELECTRON_MIRROR: config.mirrorsUrl + '/electron/',
  SASS_BINARY_SITE: config.mirrorsUrl + '/node-sass',
  // set npm config: always-auth be true
  // NPM_CONFIG_ALWAYS_AUTH: 'true',
};

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
