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

var hasCNPM = false;
for (var i = 0; i < args.length; i++) {
  if (args[i][0] !== '-') {
    args[i] = correct(args[i]);
    if (args[i] === 'cnpm') {
      hasCNPM = true;
    }
  }
}

var CWD = process.cwd();

if (program.userconfig && !fs.existsSync(program.userconfig)) {
  // make sure userconfig exists
  // or it will throw: npm ERR! Error: default value must be string or number
  fs.writeFileSync(program.userconfig, 'email =\n');
}

var nodeModulesDir = path.join(__dirname, 'node_modules');
var pangyp = path.join(nodeModulesDir, 'pangyp', 'bin', 'node-gyp.js');

args.unshift('--node-gyp=' + pangyp);
args.unshift('--registry=' + program.registry);
args.unshift('--cache=' + program.cache);
args.unshift('--disturl=' + program.disturl);
args.unshift('--userconfig=' + program.userconfig);

// node-pre-gyp will try to resolve node_modules/npm, so rename it
// see https://github.com/mapbox/node-pre-gyp/issues/144
function findNodeModuleBin(module, bin) {
  var main = require.resolve(module);
  var parts = main.split(path.sep);
  bin = bin || module;
  var ref = parts.pop();
  while (ref && (module !== ref || parts[parts.length - 1] !== 'node_modules')) {
    ref = parts.pop();
  }
  return path.join(parts.join(path.sep), '.bin', bin);
}
var cmd = findNodeModuleBin('npm');
var originalNpm = path.join(path.dirname(process.execPath), 'npm');

// if local npm not exists, use npm. happen on `$ cnpm install cnpm`
if (!fs.existsSync(cmd) || hasCNPM) {
  cmd = originalNpm;
}

debug('%s %s', cmd, args.join(' '));

var env = {
  NVM_NODEJS_ORG_MIRROR: config.mirrorsUrl + '/node',
  NVM_IOJS_ORG_MIRROR: config.mirrorsUrl + '/iojs',
  PHANTOMJS_CDNURL: config.mirrorsUrl + '/phantomjs',
  CHROMEDRIVER_CDNURL: config.mirrorsUrl + '/chromedriver',
  SELENIUM_CDNURL: config.mirrorsUrl + '/selenium',

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
