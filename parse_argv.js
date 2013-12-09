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
    .parse(process.argv);

  p.registry = p.registry || config.cnpmRegistry;
  return p;
};
