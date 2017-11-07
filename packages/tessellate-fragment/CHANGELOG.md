# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.0.0-alpha.cc5a4e4b"></a>
# [2.0.0-alpha.cc5a4e4b](https://github.com/zalando-incubator/tessellate/compare/tessellate-fragment@2.0.0-alpha.d484c6f9...tessellate-fragment@2.0.0-alpha.cc5a4e4b) (2017-11-07)


### Features

* support any bundle file type and sort files by modification date. ([cc5a4e4](https://github.com/zalando-incubator/tessellate/commit/cc5a4e4))




<a name="2.0.0-alpha.d484c6f9"></a>
# [2.0.0-alpha.d484c6f9](https://github.com/zalando-incubator/tessellate/compare/tessellate-fragment@0.3.1...tessellate-fragment@2.0.0-alpha.d484c6f9) (2017-10-27)


### Features

* **bundler:** rewrite code generator. ([2c14d22](https://github.com/zalando-incubator/tessellate/commit/2c14d22))
* **fragment:** parse target bundle from query parameter. ([fd9106b](https://github.com/zalando-incubator/tessellate/commit/fd9106b))
* update bundler api. ([2f0a907](https://github.com/zalando-incubator/tessellate/commit/2f0a907))


### BREAKING CHANGES

* tessellate-fragment does not support sources resolution via external files anymore. The bundle
source is either resolved via skipper headers or the id query parameter. This is a temporary
solution until middleware support is added.
* **bundler:** "styles" no longer supported in tessellate JSON. Exported react element in bundles is now called
"Root" instead of "Fragment".
