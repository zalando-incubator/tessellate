# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.0.0-alpha.cc5a4e4b"></a>
# [2.0.0-alpha.cc5a4e4b](https://github.com/zalando-incubator/tessellate/compare/tessellate-server@2.0.0-alpha.d484c6f9...tessellate-server@2.0.0-alpha.cc5a4e4b) (2017-11-07)




**Note:** Version bump only for package tessellate-server

<a name="2.0.0-alpha.d484c6f9"></a>
# [2.0.0-alpha.d484c6f9](https://github.com/zalando-incubator/tessellate/compare/tessellate-server@1.1.1...tessellate-server@2.0.0-alpha.d484c6f9) (2017-10-27)


### Bug Fixes

* **server:** fix configuration parsing, improve typing and docs. ([dfca147](https://github.com/zalando-incubator/tessellate/commit/dfca147))
* **server:** type casting. ([ef61810](https://github.com/zalando-incubator/tessellate/commit/ef61810))
* **server:** typings. ([3610561](https://github.com/zalando-incubator/tessellate/commit/3610561))


### Code Refactoring

* **server:** remove request module from server. ([90ae71f](https://github.com/zalando-incubator/tessellate/commit/90ae71f))


### Features

* **server:** fallback values for conf. ([4ae71aa](https://github.com/zalando-incubator/tessellate/commit/4ae71aa))
* **server:** migrate to TypeScript and rewrite APIs. ([7312865](https://github.com/zalando-incubator/tessellate/commit/7312865))


### BREAKING CHANGES

* **server:** tessellate-server no longer exports a request module.
* **server:** Replace koa-router-rx with regular koa-router, replace nconf with custom conf implementation.
