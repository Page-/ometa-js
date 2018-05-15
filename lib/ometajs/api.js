var ometajs = require('../ometajs'),
	getUglify = function() {
		return require('uglify-js')
	},
	vm = require('vm'),
	Module = require('module'),
	compressor,
	getCompressor = function() {
		if (!compressor) {
			compressor = getUglify().Compressor({
				sequences: false,
				unused: false // We need this off for OMeta
			})
		}
		return compressor
	}
	clone = function clone(obj) {
		var o = {};

		Object.keys(obj).forEach(function(key) {
			o[key] = obj[key];
		});

		return o;
	},
	defaultOption = function() {
		var args = Array.prototype.slice.call(arguments);
		for(var i = 0; i < args.length; i++) {
			if(args[i] != null) {
				return args[i];
			}
		}
		return null;
	};

//
// ### function wrapModule(module)
// #### @code {String} javascript code to wrap
// Wrap javascript code in ometajs.core context
//
function wrapModule(code, options) {
	var requireRegex = /require\(["'](.*?)["']/g,
		result,
		requires = {},
		amdRequires = [];
	if(defaultOption(options.parseRequires, ometajs.parseRequires, true)) {
		while(result = requireRegex.exec(code)) {
			requires[result[1]] = true;
		}
		for(result in requires) {
			if(requires.hasOwnProperty(result)) {
				amdRequires.push("'" + result + "'");
			}
		}
	}
	var nodeRequirePath = defaultOption(options.nodeRequirePath, ometajs.nodeRequirePath, 'ometa-core'),
		nodeRequireProperty = defaultOption(options.nodeRequireProperty, ometajs.nodeRequireProperty, '.core'),
		start =
			"(function (root, factory) {\
				if (typeof define === 'function' && define.amd) {\
					/* AMD. Register as an anonymous module. */\
					define(['require', 'exports', 'ometa-core'" + [''].concat(amdRequires).join(', ') + "], factory);\
				} else if (typeof exports === 'object') {\
					/* CommonJS */\
					factory(require, exports, require(" + JSON.stringify(nodeRequirePath) + ") " + nodeRequireProperty + ");\
				} else {\
					/* Browser globals - dangerous */\
					factory(function(moduleName) { return root[moduleName]; }, root, root.OMeta);\
				}\
			}(this, function (require, exports, OMeta) {",
		end = "}));"

	return start + code + end;
};

//
// ### function compile(code)
// #### @code {String} source code
// Compiles ometajs code into javascript
//
function compile(source, options) {
	options || (options = {});
	var tree = ometajs.BSOMetaJSParser.matchAll(source, "topLevel"),
		js = ometajs.BSOMetaJSTranslator.match(tree, "trans"),
		// Beautify code
		ast;
	if (!options.noContext) {
		js = wrapModule(js, options);
	}
	ast = getUglify().parse(js);
	ast.figure_out_scope();
	ast = ast.transform(getCompressor());
	js = ast.print_to_string({
		beautify: true
	});

	return js;
};
exports.compile = compile;

//
// ### function evalCode(code, filename)
// #### @code {String} source code
// #### @filename {String} filename for stack traces
// Compiles and evaluates ometajs code
//
function evalCode(code, filename, options) {
	options || (options = {});
	options.noContext = true;

	code = compile(code, options);
	return vm.runInNewContext(
		'var exports = {};' + code + '\n;exports',
		{OMeta: clone(ometajs.core)},
		filename || 'ometa'
	);
};
exports.evalCode = evalCode;

// Allow users to `require(...)` ometa files
require.extensions['.ometajs'] = require.extensions['.ojs'] = require.extensions['.ometa'] = function(module, filename) {
	var code = compile(require('fs').readFileSync(filename).toString(), {
		nodeRequirePath: __dirname + '/core',
		nodeRequireProperty: ''
	});

	module._compile(code, filename);
};
