![Tessellate](https://media.github.bus.zalan.do/user/115/files/7af8ba6e-91f8-11e6-854d-0e3ce4d4a3e0)

Server-side React render service. &nbsp;&nbsp; [![Build Status](https://travis-ci.org/zalando-incubator/tessellate.svg?branch=master)](https://travis-ci.org/zalando-incubator/tessellate) [![Coverage Status](https://coveralls.io/repos/github/zalando-incubator/tessellate/badge.svg?branch=master)](https://coveralls.io/github/zalando-incubator/tessellate?branch=master) [![Code Climate](https://codeclimate.com/github/zalando-incubator/tessellate/badges/gpa.svg)](https://codeclimate.com/github/zalando-incubator/tessellate) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![license](https://img.shields.io/github/license/zalando-incubator/tessellate.svg)]()

## What is Tessellate?

Tessellate is a server-side React service that creates static HTML and a JavaScript bundle from abstract JSON definitions. It is meant to be used as a **Fragment** as part of the [Mosaic](https://www.mosaic9.org) stack for micro services in the frontend but can be used independently as well.

|Package                                              |Description                                                        |Version|
|:----------------------------------------------------|:------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------|
|[tessellate-bundler](packages/tessellate-bundler)    |Builds universal React bundles from JSON.                          |[![npm version](https://badge.fury.io/js/tessellate-bundler.svg)](https://badge.fury.io/js/tessellate-bundler)    |
|[tessellate-fragment](packages/tessellate-fragment)  |Dynamic server-side React render service.                          |[![npm version](https://badge.fury.io/js/tessellate-fragment.svg)](https://badge.fury.io/js/tessellate-fragment)  |
|[tessellate-server](packages/tessellate-server)     |Common service foundation for editor and bundler.                  |[![npm version](https://badge.fury.io/js/tessellate-server.svg)](https://badge.fury.io/js/tessellate-server)      |
|[tessellate-editor](packages/tessellate-editor)      |Experimental editor for composing reusable components.             |[![npm version](https://badge.fury.io/js/tessellate-editor.svg)](https://badge.fury.io/js/tessellate-editor)      |
|[tessellate-viewer](packages/tessellate-viewer)      |Experimental layout service for composing Mosaic fragments.        |[![npm version](https://badge.fury.io/js/tessellate-viewer.svg)](https://badge.fury.io/js/tessellate-viewer)      |
|[tessellate-transform](packages/tessellate-transform)|Experimental JSON transformation tool.                             |[![npm version](https://badge.fury.io/js/tessellate-transform.svg)](https://badge.fury.io/js/tessellate-transform)|

## Dynamic fragments

A **Mosaic Fragment** is a web service that provides some partial HTML, CSS and JavaScript. Multiple Fragments can be composed into a complete web page by the [Tailor](https://github.com/zalando/tailor) layout service. Tessellate is an opinionated implementation of such a Fragment.

**tessellate-fragment** responds to incoming requests based on a customizable<sup>*</sup> logic and uses React to render precompiled JavaScript bundles into static HTML. **tessellate-bundler** compiles those bundles ahead of time based on an abstract JSON document and with the help of webpack. We call this a *dynamic* Fragment because the bundles can be updated independetly from the Fragment and because they are selected dynamically for each request.

Tessellate offers a simple yet powerful solution to integrate content providers into a Mosaic stack for micro services in the frontend. Instead of implementing specialized Fragments to render different parts of a website, you can simply transform all your content into precompiled JavaScript bundles that Tessellate knows how to render. Please read the [architecture overview](https://zalando-incubator.github.io/tessellate/Architecture.html) to learn more.

<sup>*</sup> *subject to ongoing development*

## Installation

The Tessellate micro services can easily be installed as Node modules:

```
npm i --save tessellate-bundler tessellate-fragment
```

## Configuration

Each micro service reads configuration from environment variables, command line arguments or a file. See each subproject for details.

## Development

Tessellate requires Node.js >= 7.6 and uses [Lerna](https://github.com/lerna/lerna) for managing packages. Run the following commands in the root directory to get started:

```
npm install   # Install dependencies and initialize packages.
npm run dist  # Compile all packages.
```

We recommend using [Atom](https://atom.io) text editor together with the [Nuclide](https://nuclide.io) plugin and [Flow](https://flowtype.org) for static type checking.

Here's how to install Nuclide (requires Atom) and Flow:

```
apm install nuclide
npm install -g flow-bin
```

## Contributing

For details on pull requests, commit messages and conditions for contributing please see [CONTRIBUTING.md](CONTRIBUTING.md)

## Documentation

Go to [zalando-incubator.github.io/tessellate](https://zalando-incubator.github.io/tessellate) for detailed documentation.

## License

[MIT](LICENSE)
