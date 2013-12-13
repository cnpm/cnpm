/**!
 * cnpm - lib/request.js
 *
 * Copyright(c) cnpmjs.org and other contributors.
 * MIT Licensed
 *
 * Authors:
 *  dead_horse <dead_horse@qq.com> (http://deadhorse.me)
 */

'use strict';

/**
 * Module dependencies.
 */
var urllib = require('urllib');
var fs = require('fs');
var argv = require('../parse_argv')();

var userconfig = {};
var cookie = '';

try {
  var cookieStart = false;
  var tmpCookie = [];
  var cfgs = fs.readFileSync(argv.userconfig, 'utf8').split('\n');
  for (var i = 0; i < cfgs.length; i++) {
    var cfg = cfgs[i];
    if (cfg === '[_token]') {
      cookieStart = true;
      continue;
    }

    if (!cookieStart) {
      cfg = cfg.match(/(.*?)\s+=\s+(.*)/);
      if (!cfg) {
        continue;
      }
      userconfig[cfg[1]] = cfg[2];
    } else {
      tmpCookie.push(cfg);
    }
  }
  cookie = tmpCookie.join(';');
} catch (err) {
  //ignore
}

module.exports = function (method, path, data, callback) {
  if (typeof data === 'function') {
    callback = data;
    data = null;
  }
  var options = {
    method: method,
    headers: {},
    data: data
  };
  if (cookie) {
    options.headers.Cookie = cookie;
  }
  if (userconfig._auth) {
    options.headers.authorization = 'Basic ' + userconfig._auth;
  }
  if (data) {
    options.headers['Content-Length'] = JSON.stringify(data).length;
    options.headers['Content-Type'] = 'application/json';
  }
  var host = argv.registry.replace(/\/$/, '');
  path.replace(/^\//, '');

  urllib.request(host + '/' + path, options, function (err, data, res) {
    var parsed = {};
    if (err) {
      return callback(err, parsed, data, res);
    }
    try {
      parsed = JSON.parse(data.toString());
    } catch (err) {
      //ignore
    }
    return callback(err, parsed, data, res);
  });
};
