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

var fs = require('fs');
var program = require('commander');
var config = require('./config');
var pkg = require('./package.json');
var help = require('./help');
var argv = null;

module.exports = function (cmd) {
  if (!argv) {
    argv = program.version(pkg.version, '-v, --version')
      .option('-r, --registry [registry]', 'registry url, default is ' + config.cnpmRegistry)
      .option('-w, --registryweb [registryweb]', 'web url, default is ' + config.cnpmHost)
      .option('--disturl [disturl]', 'dist url for node-gyp, default is ' + config.disturl)
      .option('-c, --cache [cache]', 'cache folder, default is ' + config.cache)
      .option('-u, --userconfig [userconfig]', 'userconfig file, default is ' + config.userconfig)
      .option('-y, --yes', 'yes all confirm');
  }

  if (cmd === 'doc') {
    argv.option('-g, --git', '[doc options] open git url');
  } else if (cmd === 'sync') {
    argv.option('--sync-publish', '[sync options] sync as publish')
      .option('--no-deps', '[sync options] do not sync dependencies and devDependencies');
  }

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
  // output command help, default options help info will output by default
  argv.on('--help', function () {
    if (!argv.registry) {
      argv.userconfig = argv.userconfig || config.userconfig;
      argv.registry = getDefaultRegistry(argv.userconfig);
    }
    help(argv);
  });
  argv.parse(process.argv.slice());

  argv.userconfig = argv.userconfig || config.userconfig;
  if (!argv.registry) {
    // try to use registry in uerconfig
    argv.registry = getDefaultRegistry(argv.userconfig);
  }
  if (!argv.disturl) {
    var isIOJS = process.execPath.indexOf('iojs') >= 0;
    argv.disturl = isIOJS ? config.iojsDisturl : config.disturl;
  }
  if (argv.disturl === 'none') {
    delete argv.disturl;
  }
  argv.registryweb = argv.registryweb || config.cnpmHost;
  argv.cache = cacheInfo || config.cache;

  if (!argv.args.length) {
    help(argv);
  }

  return argv;
};

function getDefaultRegistry(userconfig) {
  if (fs.existsSync(argv.userconfig)) {
    var content = fs.readFileSync(argv.userconfig, 'utf8');
    // registry = {registry-url}
    var m = /^registry\s*=\s*(.+)$/m.exec(content);
    if (m) {
      return m[1];
    }
  }
  return config.cnpmRegistry;
}
