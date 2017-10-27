# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.0.0-alpha.d484c6f9"></a>
# [2.0.0-alpha.d484c6f9](https://github.com/zalando-incubator/tessellate/compare/tessellate-bundler@0.1.5...tessellate-bundler@2.0.0-alpha.d484c6f9) (2017-10-27)


### Bug Fixes

* **bundler:** fix package loading. ([61d8e27](https://github.com/zalando-incubator/tessellate/commit/61d8e27))
* **bundler:** render mounting logic in generated script. ([25daed8](https://github.com/zalando-incubator/tessellate/commit/25daed8))


### Features

* **bundler:** migrate bundler to TypeScript. ([5f25d89](https://github.com/zalando-incubator/tessellate/commit/5f25d89))
* **bundler:** rewrite code generator. ([2c14d22](https://github.com/zalando-incubator/tessellate/commit/2c14d22))
* update bundler api. ([2f0a907](https://github.com/zalando-incubator/tessellate/commit/2f0a907))


### BREAKING CHANGES

* tessellate-fragment does not support sources resolution via external files anymore. The bundle
source is either resolved via skipper headers or the id query parameter. This is a temporary
solution until middleware support is added.
* **bundler:** "styles" no longer supported in tessellate JSON. Exported react element in bundles is now called
"Root" instead of "Fragment".
