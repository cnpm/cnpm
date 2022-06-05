'use strict';

const path = require('path');
const coffee = require('coffee');
const { rmSync } = require('fs');

const cnpm = path.join(__dirname, '..', 'bin', 'cnpm');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/auto-fix-bug-versions.test.js', () => {
  const root = path.join(fixtures, 'foo');
  beforeEach(() => {
    rmSync(path.join(root, 'node_modules'), { force: true, recursive: true });
  });
  afterEach(() => {
    rmSync(path.join(root, 'node_modules'), { force: true, recursive: true });
  });

  it('should ignore bug version', () => {
    return coffee.fork(cnpm, [
      'i',
      'is-my-json-valid@2.17.0',
    ], {
      cwd: root,
    })
      .debug()
      .expect('stderr', /use is-my-json-valid@2\.17\.1 instead/)
      .expect('code', 0)
      .end();
  });
});
