compiledname = $(addsuffix .js, $(addprefix lib/ometajs/ometa/, \
							 $(notdir $(basename $1))))

SUFFIX=.ometajs

all: empty-parsers $(wildcard src/*.ometajs) swap-parsers

empty-parsers:
	@rm -f lib/ometajs/ometa/parsers.js.tmp
	@rm -f lib/ometajs/ometa/parsers.js.tmp.2

swap-parsers:
	@node bin/ometajs2js --root "../core" -i lib/ometajs/ometa/parsers.js.tmp \
		-o lib/ometajs/ometa/parsers.js.tmp.2
	@node_modules/uglify-js/bin/uglifyjs lib/ometajs/ometa/parsers.js.tmp.2 -b >\
		lib/ometajs/ometa/parsers.js
	@rm -f lib/ometajs/ometa/parsers.js.tmp
	@rm -f lib/ometajs/ometa/parsers.js.tmp.2

%.ometajs:
	@cat $@ >> lib/ometajs/ometa/parsers.js.tmp

test:
	nodeunit test/unit/*-test.js

docs:
	docco lib/ometajs/*.js

.PHONY: all docs
