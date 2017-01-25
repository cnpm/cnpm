'ues strict';

module.exports = {
  write: true,
  prefix: '^',
  devprefix: '^',
  registry: 'https://r.cnpmjs.org',
  exclude: [
    'test/fixtures',
  ],
  dep: [
    'npminstall',
    'npm',
  ],
  devdep: [
  ],
  keep: [
    'cross-spawn',
  ],
  semver: [
    'npm@3',
  ],
};
