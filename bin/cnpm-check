#!/usr/bin/env node

const path = require('node:path');
const urllib = require('urllib');
const config = require('../lib/config');

const pkg = require(path.join(process.cwd(), 'package.json'));

async function checkOnePackage(name) {
  const url = config.cnpmRegistry + '/' + name + '/latest';
  try {
    const response = await urllib.request(url, {
      headers: { 'user-agent': 'cnpm-check' },
      dataType: 'json',
    });
    const result = response.data;
    const localVersion = String(pkg.dependencies[name] || '*');
    const localVersionCheck = localVersion.replace(/^[^\.\d]+/g, '');
    const remoteVersion = result && result.version || 'unknow';
    if (remoteVersion !== localVersionCheck) {
      console.log('[' + name + '] new version: ' + remoteVersion + ', local version: ' + localVersion);
    }
  } catch (err) {
    console.error(err);
    console.log('[' + name + '] check version error: ' + err.message);
  }
}

async function checkUpdate() {
  const names = Object.keys(pkg.dependencies);
  for (const name of names) {
    await checkOnePackage(name);
  }
}

checkUpdate();
