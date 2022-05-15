'use strict';

const path = require('path');
const coffee = require('coffee');

const cnpm = path.join(__dirname, '..', 'bin', 'cnpm');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/cnpm-update.test.js', () => {
  const root = path.join(fixtures, 'update-package');
  it('should ignore bug version', async () => {
    await coffee.fork(cnpm, [
      'update',
    ], {
      cwd: root,
    })
      .debug()
      .expect('stdout', /\[cnpm:update] Removing/)
      .expect('stdout', /\[cnpm:update] Running "cnpm install" on /)
      .expect('code', 0)
      .end();
    await coffee.fork(cnpm, [
      'update',
    ], {
      cwd: root,
    })
      .debug()
      .expect('stdout', /\[cnpm:update] Removing/)
      .expect('stdout', /\[cnpm:update] Running "cnpm install" on /)
      .expect('code', 0)
      .end();
  });
});
