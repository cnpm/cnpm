cnpm
=======

[![NPM Version](https://img.shields.io/npm/v/cnpm.svg?style=flat-square)](https://npmjs.com/package/cnpm)
[![NPM Download](https://img.shields.io/npm/dm/cnpm.svg?style=flat-square)](https://npmjs.com/package/cnpm)
[![NPM Quality](http://npm.packagequality.com/shield/cnpm.svg?style=flat-square)](http://packagequality.com/#?package=cnpm)
[![GitHub Actions CI](https://github.com/cnpm/cnpm/actions/workflows/nodejs.yml/badge.svg?style=flat-square)](https://github.com/cnpm/cnpm/actions/workflows/nodejs.yml)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcnpm%2Fcnpm.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcnpm%2Fcnpm?ref=badge_shield)

![logo](https://raw.github.com/cnpm/cnpmjs.org/master/logo.png)

cnpm: npm client for [cnpmjs.org](https://cnpmjs.org)

## Requirements

|         | Minimum | Recommended |
|---------|---------|-------------|
| Node.js | 14.0.0  | LTS         |

## Install

```bash
$ npm install cnpm -g
```

If you're in China, maybe you should install it from our [China mirror](https://registry.npmmirror.com):

```bash
$ npm install cnpm -g --registry=https://registry.npmmirror.com
```

## Usage

Support all commands just like `npm`.

### Sync packages from `npm`

```bash
$ cnpm sync [moduleName]
```

### Open package document or git web url

```bash
$ cnpm doc [name]
$ cnpm doc -g [name] # open git web url directly
```

## Build your own private registry npm cli

```bash
$ npm install cnpm -g

# then alias it
$ alias mynpm='cnpm --registry=https://registry.npm.example.com \
  --registryweb=https://npm.example.com \
  --userconfig=$HOME/.mynpmrc'
```

## Install with original npm cli

cnpm using [npminstall](https://github.com/cnpm/npminstall) by default.
If you don't like symlink mode for `node_modules`, you can change the installer to original npm.
But you will lose the fastest install speed.

```bash
$ cnpm i --by=npm react-native
```

## License

[MIT](LICENSE.txt)

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/156269?v=4" width="100px;"/><br/><sub><b>fengmk2</b></sub>](https://github.com/fengmk2)<br/>|[<img src="https://avatars.githubusercontent.com/u/985607?v=4" width="100px;"/><br/><sub><b>dead-horse</b></sub>](https://github.com/dead-horse)<br/>|[<img src="https://avatars.githubusercontent.com/u/1147375?v=4" width="100px;"/><br/><sub><b>alsotang</b></sub>](https://github.com/alsotang)<br/>|[<img src="https://avatars.githubusercontent.com/u/26602940?v=4" width="100px;"/><br/><sub><b>0xflotus</b></sub>](https://github.com/0xflotus)<br/>|[<img src="https://avatars.githubusercontent.com/u/114114?v=4" width="100px;"/><br/><sub><b>weakish</b></sub>](https://github.com/weakish)<br/>|[<img src="https://avatars.githubusercontent.com/u/4635838?v=4" width="100px;"/><br/><sub><b>gemwuu</b></sub>](https://github.com/gemwuu)<br/>|
| :---: | :---: | :---: | :---: | :---: | :---: |
[<img src="https://avatars.githubusercontent.com/u/543405?v=4" width="100px;"/><br/><sub><b>ibigbug</b></sub>](https://github.com/ibigbug)<br/>|[<img src="https://avatars.githubusercontent.com/u/1094697?v=4" width="100px;"/><br/><sub><b>qiu8310</b></sub>](https://github.com/qiu8310)<br/>|[<img src="https://avatars.githubusercontent.com/u/29791463?v=4" width="100px;"/><br/><sub><b>fossabot</b></sub>](https://github.com/fossabot)<br/>|[<img src="https://avatars.githubusercontent.com/u/360661?v=4" width="100px;"/><br/><sub><b>popomore</b></sub>](https://github.com/popomore)<br/>|[<img src="https://avatars.githubusercontent.com/u/955484?v=4" width="100px;"/><br/><sub><b>xieren58</b></sub>](https://github.com/xieren58)<br/>

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Sat May 14 2022 18:18:46 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcnpm%2Fcnpm.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcnpm%2Fcnpm?ref=badge_large)
