![Tessellate](https://media.github.bus.zalan.do/user/115/files/7af8ba6e-91f8-11e6-854d-0e3ce4d4a3e0)

Micro service stack for dynamic fragments. &nbsp;&nbsp; [![Build Status](https://travis-ci.org/zalando-incubator/tessellate.svg?branch=master)](https://travis-ci.org/zalando-incubator/tessellate) [![Coverage Status](https://coveralls.io/repos/github/zalando-incubator/tessellate/badge.svg?branch=master)](https://coveralls.io/github/zalando-incubator/tessellate?branch=master) [![Code Climate](https://codeclimate.com/github/zalando-incubator/tessellate/badges/gpa.svg)](https://codeclimate.com/github/zalando-incubator/tessellate)

## What is Tessellate?

Tessellate is a collection of micro services built on top of the [Mosaic](https://www.mosaic9.org) architecture. It is comprised of the following parts:

* **tessellate-editor** – Editor for composing reusable components.
* **tessellate-bundler** – Builds portable ReactJS modules from abstract component structures.
* **tessellate-fragment** – Agnostic fragment for rendering any ReactJS module.
* **tessellate-viewer** – Simple layout service for composing fragments.

## Dynamic fragments

A Mosaic fragment is a web service that provides parts of a web page that can be composed together with other fragments by the [Tailor](https://github.com/zalando/tailor) layout service.

Tessellate fragments can respond to requests dynamically as they are agnostic about the content they provide. Any prepared ReactJS module can be rendered by a Tessellate fragment.

## Installation

Tessellate micro services can easily be installed as Node modules:

```
npm i --save tessellate-fragment
```

## Configuration

Each micro service reads configuration from environment variables, command line arguments or a file. See each subproject for details.
