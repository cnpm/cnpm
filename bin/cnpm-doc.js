#!/usr/bin/env node

const request = require('npm-request');
const giturl = require('giturl');
const utils = require('../lib/utils');
const argv = require('../lib/parse_argv')('doc');
const pkgName = argv.args[1];
const docurl = argv.registryweb + '/package/' + pkgName;

if (!pkgName) {
  argv.help();
  process.exit(0);
}

if (!argv.git) {
  utils.openurl(docurl);
  process.exit(0);
}

console.log('getting "%s" package info...', pkgName);
request({
  method: 'GET',
  path: pkgName + '/latest',
}, {
  registry: argv.registry,
}, function(err, info) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }

  if (!info.name) {
    console.log('"%s" package not exists', pkgName);
    process.exit(0);
  }

  const repository = info.repository;
  if (!repository || !repository.url) {
    return utils.openurl(docurl);
  }

  const url = giturl.parse(repository.url) || docurl;
  utils.openurl(url);
});
