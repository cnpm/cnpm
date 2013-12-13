/**!
 * cnpm - parse_argv.js
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

var program = require('commander');
var config = require('./config');

module.exports = function () {
  var p = program
    .option('-r, --registry [registry]', 'registry url, default is ' + config.cnpmRegistry)
    .option('-w, --registryweb [registryweb]', 'website url, default is ' + config.cnpmHost)
    .option('-c, --cachepath [cachepath]', 'cache folder, default is ' + config.cache)
    .option('-u, --userconfig [userconfig]', 'userconfig file, default is ' + config.userconfig)
    .parse(process.argv);

  p.registry = p.registry || config.cnpmRegistry;
  p.registryweb = p.registryweb || config.cnpmHost;
  p.cachepath = p.cachepath || config.cache;
  p.userconfig = p.userconfig || config.userconfig;
  return p;
};
