/**!
 * cnpm - parse_argv.js
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

var program = require('commander');
var config = require('./config');
var pkg = require('./package.json');
var help = require('./help');
var argv;
module.exports = function () {
  if (argv) {
    return argv;
  }
  argv = program
    .version(pkg.version, '-v, --version')
    .option('-r, --registry [registry]', 'registry url, default is ' + config.cnpmRegistry)
    .option('--disturl [disturl]', 'dist url for node-gyp, default is ' + config.disturl)
    .option('-w, --registryweb [registryweb]', 'website url, default is ' + config.cnpmHost)
    .option('-c, --cache [cache]', 'cache folder, default is ' + config.cache)
    .option('-u, --userconfig [userconfig]', 'userconfig file, default is ' + config.userconfig)
    .option('-y, --yes', 'yes all confirm');

  // commander's bug, fix here
  // https://github.com/visionmedia/commander.js/pull/189
  var cacheInfo;
  argv.on('cache', function (cache) {
    if (typeof cache === 'string') {
      cacheInfo = cache;
      return;
    }
    argv.args = ['cache'].concat(cache || []);
  });

  // custom help message
  var helpInfo = {};
  argv.on('registry', function (registry) {
    helpInfo.registry = registry;
  });
  argv.on('userconfig', function (userconfig) {
    helpInfo.userconfig = userconfig;
  });
  // output command help, default options help info will output by default
  argv.on('--help', function () {
    help(helpInfo);
  });
  argv.parse(process.argv);

  if (!argv.args.length) {
    argv.help();
  }

  argv.registry = argv.registry || config.cnpmRegistry;
  argv.disturl = argv.disturl || config.disturl;
  argv.registryweb = argv.registryweb || config.cnpmHost;
  argv.cache = cacheInfo || config.cache;
  argv.userconfig = argv.userconfig || config.userconfig;
  return argv;
};

