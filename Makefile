TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 1000
MOCHA_OPTS =
VERSION = $(shell cat package.json | grep version | awk -F'"' '{print $$4}')

install:
	@npm install --registry=http://registry.cnpmjs.org --disturl=http://dist.cnpmjs.org

autod: install
	@./node_modules/.bin/autod -w -k npm -e build
	@$(MAKE) install

jshint: install
	@./node_modules/.bin/jshint .

test: install
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov:
	@$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=travis-cov

test-cov-html:
	@rm -f coverage.html
	@$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=html-cov > coverage.html
	@ls -lh coverage.html

test-coveralls: test
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@-$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js

test-all: jshint test test-cov

build: install
	@rm -rf ./build
	@mkdir -p ./build/cnpm
	@cp -Rf ./bin ./node_modules *.md *.js package.json ./build/cnpm
	@cd ./build && tar -czf cnpm-$(VERSION).tgz ./cnpm
	@qboxrsctl del dist cnpm/cnpm-$(VERSION).tgz
	@qboxrsctl put -c dist cnpm/cnpm-$(VERSION).tgz ./build/cnpm-$(VERSION).tgz
	@qboxrsctl del dist cnpm/cnpm-latest.tgz
	@qboxrsctl cp "dist:cnpm/cnpm-$(VERSION).tgz" "dist:cnpm/cnpm-latest.tgz"
	@echo "download url: http://dist.u.qiniudn.com/cnpm/cnpm-$(VERSION).tgz"

.PHONY: test
