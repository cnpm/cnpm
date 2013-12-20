cnpm
=======

[![NPM](https://nodei.co/npm/cnpm.png?downloads=true&stars=true)](https://nodei.co/npm/cnpm/)

![logo](https://raw.github.com/fengmk2/cnpmjs.org/master/logo.png)

cnpm: npm client for [cnpmjs.org](http://cnpmjs.org)

## Install

```bash
$ npm install cnpm -g
```

## Usage

Support all commands just like `npm`.

### Sync packages from `npm`

```bash
$ cnpm sync [moduleName]
```

## Build your own private registry npm cli

```
$ npm install cnpm -g

#then alias it
$ alias tnpm='cnpm --registry=http://registry.npm.alibaba-inc.com\
 --registryweb=http://npm.alibaba-inc.com\
 --cache=$HOME/.npm/.cache/tnpm\
 --userconfig=$HOME/.tnpmrc'

#or put this in your .zshrc / .bashrc
$ echo "alias tnpm='cnpm --registry=http://registry.npm.alibaba-inc.com\
 --registryweb=http://npm.alibaba-inc.com\
 --cache=$HOME/.npm/.cache/tnpm\
 --userconfig=$HOME/.tnpmrc'" >> $HOME/.zshrc && source $HOME/.zshrc
```

## Authors

```bash
$ git summary

 project  : cnpm
 repo age : 11 days
 active   : 14 days
 commits  : 44
 files    : 17
 authors  :
    38  fengmk2                 86.4%
     5  dead_horse              11.4%
     1  不四                  2.3%
```

## License

(The MIT License)

Copyright(c) cnpmjs.org and other contributors.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
