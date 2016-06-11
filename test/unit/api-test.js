var common = require('../fixtures/common');

exports['compile should work (w/o nodeRequirePath)'] = function(test) {
	var simple = common.compile('simple');

	test.ok(simple);
	test.ok(/require\("[^"]+"\)/g.test(simple));

	test.done();
};

exports['compile should work (with nodeRequirePath)'] = function(test) {
	var simple = common.compile('simple', { nodeRequirePath: 'test' });

	test.ok(simple);
	test.ok(/require\("test"\)/g.test(simple));

	test.done();
};

var testMatches = {
	FormArray: [ 'simple' ],
	FormObject: { 'simple': true },
	ObjectRules: { 'simple': true },
	ObjectRulesMatchAll1: { 'simple': true },
	ObjectRulesMatchAll2: { 'simple': true, 'simpler': true },
	ObjectRulesMatchPartial1: { 'simple': true, 'simpler': true },
	ObjectRulesMatchPartial2: { 'simple': true },
	ObjectRulesMatchOptional: { 'simple': true }
};

var runTests = function(test, grammar) {
	Object.keys(testMatches).forEach(function(rule) {
		test.equal(grammar.match(testMatches[rule], rule), 'ok');
	});
};

exports['evalCode should work'] = function(test) {
	var simple = common.evalCode('simple').Simple;

	runTests(test, simple);

	test.done();
};

exports['require("...ometajs") should work'] = function(test) {
	var simple = common.require('simple').Simple;

	runTests(test, simple);

	test.done();
};
