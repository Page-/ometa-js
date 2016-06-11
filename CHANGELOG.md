* Added support for optionally matching keys of an object, eg `@{ foo?: true }`
* Added support for matching some keys of an object against corresponding rules,
	eg `%{ foo: FooRule }`
* Added support for matching all keys of an object against corresponding rules,
	eg `@{ foo: FooRule }`
* Added support for using `_form` (`[]`) on an object input,
	for this the object is converted into a list of key, value tuples
	eg `{ foo: 'bar' }` -> `[ ['foo', 'bar'] ]`

v1.4.2

* Improved the performance of `_not` by allowing it to be optimised.

v1.4.1

* Fixed a bug with function declarations.

v1.4.0

* Added support for named function expressions.
* Added support for carrying function names over into the generated javascript.

v1.3.6

* Massive performance improvements when calling any rule with arguments.
