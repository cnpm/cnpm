
6.0.0 / 2018-05-28
==================

**features**
  * [[`718b5d9`](http://github.com/cnpm/cnpm/commit/718b5d956505982c41e6089feae43b3253d271c4)] - feat: [BREAKING] use npm 6.1.0 (#254) (fengmk2 <<fengmk2@gmail.com>>)

5.3.0 / 2018-05-04
==================

**features**
  * [[`e63a5f9`](http://github.com/cnpm/cnpm/commit/e63a5f9eb810427acce820d2fc4b7a2c802b02b6)] - feat: support auto fix bug-versions (#252) (fengmk2 <<fengmk2@gmail.com>>)

5.2.0 / 2018-01-24
==================

**features**
  * [[`ceec3e7`](http://github.com/cnpm/cnpm/commit/ceec3e79a4004c1aaa256ba3b412040188ab6f16)] - feat: add --ignore-custom-config to ignore npmrc and cnpmrc (#241) (fengmk2 <<fengmk2@gmail.com>>)

5.1.1 / 2017-08-07
==================

**fixes**
  * [[`289be77`](http://github.com/cnpm/cnpm/commit/289be774159575a6a28ac7983ee730fca0ab02ff)] - fix: downgrade commander to 2.10.0 (#211) (fengmk2 <<fengmk2@gmail.com>>)

5.1.0 / 2017-08-02
==================

  * feat: support set proxy on cnpmrc file (#208)

5.0.0 / 2017-06-13
==================

  * test: node 8
  * fix: taobao npm registry use http protocol to support gzip
  * feat: [BREAKING_CHANGE] use npminstall@3

4.5.0 / 2017-02-03
==================

  * test: ignore node 4 on windows test
  * fix: dont auto create userconfig file
  * feat: should show full versions

4.4.2 / 2016-11-21
==================

  * fix: use fork instead of spawn on npminstall mode (#164)

4.4.1 / 2016-11-19
==================

  * test: fix invaild regex on windows
  * test: add node v7
  * fix: cnpm can install itself now

4.4.0 / 2016-10-15
==================

  * feat: support custom installer (#148)

4.3.2 / 2016-08-24
==================

  * deps: npminstall@2.1.0

4.3.1 / 2016-08-03
==================

  * chore: use npminstall@2 (#135)

4.3.0 / 2016-07-29
==================

  * feat: use npminstall@beta (#131)
  * chore: add NodeJS version requirements (#116)

4.2.0 / 2016-03-12
==================

  * refactor: remove node-gyp
  * refactor: use npminstall

4.1.0 / 2015-11-02
==================

 * test: add node v5
 * feat: install node-sass from China mirror

4.0.0 / 2015-10-06
==================

 * deps: use npm@3

3.4.1 / 2016-02-20
==================

  * doc: remove disturl
  * fix when info.log not exists

3.4.0 / 2015-11-12
==================

 * feat: add --proxy support

3.3.1 / 2015-11-09
==================

  * update `giturl` to 1.0.0

3.3.0 / 2015-11-02
==================

 * test: add node v5
 * feat: install node-sass from China mirror

3.2.3 / 2015-10-05
==================

 * fix: ignore --disturl and --userconfig=none
 * test: appveyor test node v4
 * fix: install chromedriver from oss directly

3.2.2 / 2015-09-11
==================

 * fix: use node-gyp@3 to support node 4.x+

3.2.1 / 2015-09-07
==================

 * deps npm@2.14.2

3.2.0 / 2015-09-06
==================

 * deps: upgrade npm to 2.14.3

3.1.0 / 2015-07-18
==================

  * bump npm

3.0.2 / 2015-05-11
==================

 * Add ELECTRON_MIRROR

3.0.1 / 2015-04-05
==================

 * Resolve npm command to local npm bin, not global. (@qiu8310)

3.0.0 / 2015-03-09
==================

 * use pangyp instead of node-gyp

2.0.1 / 2015-02-17
==================

 * use execPath

2.0.0 / 2015-02-16
==================

 * support iojs and cpp build
 * feat(mirrors): add node, iojs, chromedriver, selenium mirrors

1.2.0 / 2014-10-05
==================

  * bump npm@2.1

1.1.0 / 2014-09-24
==================

  * bump npm to 2
  * no need to sync twice

1.0.0 / 2014-09-01
==================

  * update readme
  * bump npm

0.5.2 / 2014-07-28
==================

  * sync dependencies if package.private = true, close #38

0.5.1 / 2014-07-28
==================

  * fix sync display

0.5.0 / 2014-07-28
==================

  * bump npm to ~2.0.0-alpha-5

0.4.0 / 2014-07-21
==================

 * use npm@1.5.x support scoped packages
 * tell users in China install from taobao npm

0.3.0 / 2014-07-05
==================

 * fix #34 use userconfig registry by default
 * use cross-spawn

0.2.2 / 2014-07-02
==================

 * fix #31 space char on windows path.

0.2.1 / 2014-07-02
==================

 * use taobao npm https

0.2.0 / 2014-06-05
==================

 * add PHANTOMJS_CDNURL env

0.1.3 / 2014-05-14
==================

 * change to npm.taobao.org/dist
 * fix sync result display

0.1.2 / 2014-04-22
==================

  * Merge pull request #32 from cnpm/sync-from-cnpm
  * sync from cnpm and taobao npm

0.1.1 / 2014-04-19
==================

  * add auto-correct for some long cmds

0.1.0 / 2014-04-17
==================

 * switch registry to taobao npm registry
 * remove unused commander
 * remove unused 'child_process' in bin/cnpm
 * download from cdn

0.0.35 / 2014-04-03
==================

 * deps npm instead of npm-beta
 * update install from cnpm

0.0.33 / 2014-03-18
==================

  * fix missing git option detect

0.0.32 / 2014-03-18
==================

  * cnpm doc -g module open git web url. fixed #25

0.0.31 / 2014-03-15
==================

 * if cnpm install cnpm, use npm cmd

0.0.30 / 2014-03-15
==================

 * fix cnpm install cnpm fail bug

0.0.29 / 2014-03-13
==================

  * update to deps npm-beta, use latest version of npm
  * Release 0.0.28
  * update urllib

0.0.28 / 2014-03-07
==================

  * update urllib
  * add jshint
  * use cnpmjs.org/dist

0.0.27 / 2014-02-14
==================

  * fix cnpm publish not work bug. fixed #23

0.0.26 / 2014-01-24
==================

  * add preferGlobal

0.0.25 / 2014-01-15
==================

  * add make autod
  * use npm request

0.0.24 / 2014-01-14
==================

  * request timeout default is 30 seconds

0.0.23 / 2014-01-14
==================

  * add registryweb args

0.0.22 / 2014-01-10
==================

  * Sync package as publish.

0.0.21 / 2013-12-23
==================

  * add search sub command, fixed #18

0.0.20 / 2013-12-22
==================

  * remove console log

0.0.19 / 2013-12-22
==================

  * fix cannot get sub command with options, fixed #16
  * fix help info output error, fixed #15
  * cnpm --help: add command `v` (@weakish)

0.0.18 / 2013-12-20
==================

  * cnpm sync -y

0.0.17 / 2013-12-20
==================

  * fix check version

0.0.16 / 2013-12-20
==================

  * support check >=x.y.z version. fixed #13

0.0.15 / 2013-12-20
==================

  * Merge pull request #12 from fengmk2/fix-source-npm-command
  * fix origin npm commands

0.0.14 / 2013-12-18
==================

  * use default disturl alias http://dist.u.qiniudn.com

0.0.13 / 2013-12-14
==================

  * support $ cnpm sync [moduleName1 moduleName2 ...], fixed #10
  * fix origin_npm, use --cache instead of --cachepath

0.0.12 / 2013-12-13
==================

  * support sync all the dependencies of a project,fix #6

0.0.11 / 2013-12-13
==================

  * support alias to own private registry, fixed #5

0.0.10 / 2013-12-13
==================

  * add userconfig support. fixed #3

0.0.9 / 2013-12-12
==================

  * fix HOME missing on win32 bug. fixed #1

0.0.8 / 2013-12-12
==================

  * fix check timeout bug

0.0.7 / 2013-12-11
==================

  * add cnpm user command

0.0.6 / 2013-12-10
==================

  * fix doc missing

0.0.5 / 2013-12-09
==================

  * support --registry on sync

0.0.4 / 2013-12-09
==================

  * fix sync log

0.0.3 / 2013-12-09
==================

  * fix doc url. fixed fengmk2/cnpmjs.org#29

0.0.2 / 2013-12-09
==================

  * fix sync cmd

0.0.1 / 2013-12-09
==================

  * init
