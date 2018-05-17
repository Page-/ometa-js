v1.5.2

* Lazy load uglifyjs and the cli run method as it's never used by compiled grammars so we can save some startup time and memory usage in those cases.

v1.5.1

* Optimise `_many`

v1.5.0

* Optimise `_or`
* Optimise `_not` in the case the branch tracking is disabled.
* Optimise super/`^` calls that don't pass arguments

v1.4.2

* Improved the performance of `_not` by allowing it to be optimised.

v1.4.1

* Fixed a bug with function declarations.

v1.4.0

* Added support for named function expressions.
* Added support for carrying function names over into the generated javascript.

v1.3.6

* Massive performance improvements when calling any rule with arguments.
