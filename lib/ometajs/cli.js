var ometajs = require('../ometajs'),
	q = require('q'),
	fs = require('fs');

//
// ### function run (options)
// #### @options {Object} Compiler options
// Compiles input stream or file and writes result to output stream or file
//
exports.run = function run(options) {
	var deferred = q.defer(),
		input = [];

	options.input.on('data', function(chunk) {
		input.push(chunk);
	});

	options.input.once('end', function() {
		finish(input.join(''));
	});

	options.input.resume();

	function finish(input) {
		try {
			var out = ometajs.translateCode(input, options);
		} catch (e) {
			if (e.OMeta != null && e.OMeta.line != null) {
				console.error('Parsing error at: ' + e.OMeta.line + ':' + e.OMeta.column);
			}

			deferred.reject(e);
			return;
		}

		options.output.write(out);
		if (options.output !== process.stdout) {
			options.output.end();
		} else {
			options.output.write('\n');
		}

		deferred.resolve();
	};

	return deferred.promise;
};
