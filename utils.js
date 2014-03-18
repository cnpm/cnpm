/**!
 * cnpm - utils.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

/*jshint -W079 */
var open = require('open');

exports.openurl = function (url) {
  open(url, function (err, stdout, stderr) {
    if (err) {
      console.log('Can not open browser, please open your browser to visit: ' + url);
      process.exit(0);
    }
    if (stdout || stderr) {
      console.log(stdout, stderr);
    }
    process.exit(0);
  });
};
