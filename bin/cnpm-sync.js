#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');
const { setTimeout } = require('node:timers/promises');
const querystring = require('node:querystring');
const Bagpipe = require('bagpipe');
const request = require('npm-request');
const argv = require('../lib/parse_argv')('sync');
const urllib = require('urllib');

const args = argv.args;
const registrys = [ argv.registry ];
const registrywebs = {};
registrywebs[argv.registry] = argv.registryweb;

const nodeps = !argv.deps;
const publish = !!argv.syncPublish;

const names = args.slice(1);
let packageName;
let dependencies = [];
let isPrivate = false;

const LOG_FETCH_INTERVAL = 2000;

const packagePath = path.join(process.cwd(), 'package.json');
if (!names.length && fs.existsSync(packagePath)) {
  try {
    console.log('Parse `package.json` file now...');
    const pkg = require(packagePath);
    packageName = pkg.name;
    const dependenciesMap = {};
    for (const key in (pkg.dependencies || {})) {
      dependenciesMap[key] = pkg.dependencies[key];
    }
    for (const key in (pkg.devDependencies || {})) {
      dependenciesMap[key] = pkg.devDependencies[key];
    }
    dependencies = Object.keys(dependenciesMap);
    isPrivate = !!pkg.private;
  } catch (err) {
    console.log('Parse `package.json` file error: %s', err.message);
    process.exit(1);
  }
}

if (names && names.length) {
  syncByNames(names);
} else if (packageName) {
  syncByPackage(packageName);
} else {
  console.log(`Usage: $ cnpm sync [moduleName1 moduleName2 ...]
Options:
  --sync-publish        sync as publish
  --no-deps        do not sync dependencies and devDependencies`);
  process.exit(1);
}

async function showLog(syncInfo, showedLines = 0) {

  const stateRes = await urllib.request(syncInfo.stateUrl, {
    dataType: 'json',
  });

  const logRes = await urllib.request(syncInfo.logUrl, { followRedirect: true });
  const currentLog = logRes.data.toString().trim();

  const { state } = stateRes.data;
  if (
    state === 'processing' ||
    state === 'waiting' ||
    state === 'success'
  ) {
    const currentLines = currentLog.split('\n').length;
    if (currentLines > showedLines) {
      console.log(currentLog.split('\n').slice(showedLines).join('\n'));
      showedLines = currentLog.split('\n').length;
      // flush success log
      if (state === 'success') {
        return;
      }
    }
    await setTimeout(LOG_FETCH_INTERVAL);
    await showLog(syncInfo, showedLines);
    return;
  }

  // other log
  const finalLog = logRes.data.toString().trim();
  console.log(finalLog.split('\n').slice(showedLines).join('\n'));
}


function sync(registry, name, callback) {
  let url = name + '/sync?';
  url += querystring.stringify({
    publish,
    nodeps,
  });
  console.log('sync %s, PUT %s/%s', name, registry, url);
  const realRegistry = registry === 'https://registry.npmmirror.com' ?
    'https://registry-direct.npmmirror.com' : registry;
  request({
    method: 'PUT',
    path: url,
    data: {},
  }, {
    registry: realRegistry,
    configFile: argv.userconfig,
  }, function(err, result, data, res) {
    if (err) {
      return callback(err);
    }
    if (res.statusCode === 404 || !result || !result.ok) {
      if (result.reason) {
        console.error('[%s] %s: %s', res.statusCode, result.error, result.reason);
      }
      return callback(null, {
        ok: false,
        statusCode: res.statusCode,
        result,
        data,
      });
    }
    const syncInfo = {
      name,
      lastLines: 0,
      stateUrl: `${registry}/-/package/${name}/syncs/${result.logId}`,
      logUrl: `${registry}/-/package/${name}/syncs/${result.logId}/log`,
    };
    console.log('logUrl: %s', syncInfo.logUrl);
    showLog(syncInfo).then(() => callback(null, { ok: true })).catch(callback);
  });
}

function syncByNames(names) {
  const queue = new Bagpipe(1);
  let remain = names.length * registrys.length;
  if (!names) {
    console.log('Can not find any packages to sync.');
    process.exit(0);
  }
  console.log('Start sync %j.', names);
  const fail = {};
  const success = {};
  registrys.forEach(function(registry) {
    names.forEach(function(name) {
      queue.push(sync, registry, name, function(err, data) {
        remain--;
        if (err) {
          console.error(err.message);
          fail[name] = true;
        } else if (!data.ok) {
          fail[name] = true;
        } else {
          success[name] = true;
        }
        if (!remain) {
          for (const n in success) {
            if (fail[n]) {
              delete success[n];
            }
          }
          console.log('Sync all packages done, successed: %j, failed: %j',
            Object.keys(success), Object.keys(fail));
          process.exit(0);
        }
      });
    });
  });
}

function syncByPackage(packageName) {
  if (isPrivate) {
    return syncByNames(dependencies);
  }

  if (argv.yes) {
    dependencies.unshift(packageName);
    return syncByNames(dependencies);
  }

  syncByNames([ packageName ]);
}
