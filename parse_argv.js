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

var argv;
module.exports = function () {
  if (argv) {
    return argv;
  }
  argv = program
    .option('-r, --registry [registry]', 'registry url, default is ' + config.cnpmRegistry)
    .option('-w, --registryweb [registryweb]', 'website url, default is ' + config.cnpmHost)
    .option('-c, --cachepath [cachepath]', 'cache folder, default is ' + config.cache)
    .option('-u, --userconfig [userconfig]', 'userconfig file, default is ' + config.userconfig)
    .parse(process.argv);

  argv.registry = argv.registry || config.cnpmRegistry;
  argv.registryweb = argv.registryweb || config.cnpmHost;
  argv.cachepath = argv.cachepath || config.cache;
  argv.userconfig = argv.userconfig || config.userconfig;
  return argv;
};
