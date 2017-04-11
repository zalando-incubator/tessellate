---
description: Configuration of Tessellate services.
---

# Configuration

This section contains information for configuring Tessellate services in production. Each service follows the twelve-factor principle and relies on [configuration in environment variables](https://12factor.net/config). We use the [nconf](https://www.npmjs.com/package/nconf) library to achieve a hierarchical configuration model. You can read the `config.yaml` file of each service to discover the respective default values.

## tessellate-bundler

* `APP_PORT` – Port on which the service listens.
* `MORGAN_FORMAT` – [Format](https://github.com/expressjs/morgan#predefined-formats) for the [morgan](https://github.com/expressjs/morgan) HTTP request logger.
* `MORGAN_THRESHOLD` – Do not log HTTP requests with status code values below this number.
* `PUBLISH_TARGET` – Path under which to publish compiled bundles. Must start with `protocol://` where *protocol* can be one of the following:
    * `file` – Local file system path.
    * `s3` – AWS S3 path. **Not implemented ([#7](https://github.com/zalando-incubator/tessellate/issues/7))**
* `NPM_MODULES` – List of additional npm modules which are required to compile bundles. Also see [webpack-sandboxed](https://github.com/mfellner/webpack-sandboxed).
* `NPM_EXTERNALS` – List of npm modules which should be excluded from compiled bundles. Also see [webpack externals](https://webpack.js.org/configuration/externals).

## tessellate-fragment

* `APP_PORT` – Port on which the service listens.
* `MORGAN_FORMAT` – [Format](https://github.com/expressjs/morgan#predefined-formats) for the [morgan](https://github.com/expressjs/morgan) HTTP request logger.
* `MORGAN_THRESHOLD` – Do not log HTTP requests with status code values below this number.
* `BUNDLES_SOURCE` – Remote address under which to resolve precompiled bundles.

Under construction 🏗️ 🚧 👷
