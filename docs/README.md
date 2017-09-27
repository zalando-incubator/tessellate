![Tessellate](https://media.github.bus.zalan.do/user/115/files/7af8ba6e-91f8-11e6-854d-0e3ce4d4a3e0)

[Tessellate](https://github.com/zalando-incubator/tessellate) is a server-side React service that creates static HTML and a JavaScript bundle from abstract JSON definitions. It is meant to be used as a **Fragment** as part of the [Mosaic](https://www.mosaic9.org) stack for micro services in the frontend but can be used independently as well.

With Tessellate you can create *dynamic* Fragments compatiple with the Mosaic stack that provide HTML, CSS and JavaScript based on precompiled JavaScript bundles and the context of each HTTP request.

## Overview

Tessellate consists of two major components and some auxiliary tools or libraries:

* **tessellate-bundler** creates JavaScript bundles of React component trees from an abstract JSON definition. [📦](https://www.npmjs.com/package/tessellate-bundler)
* **tessellate-fragment** dynamically renders prepared bundles into static HTML and merges external properties into the React components. [📦](https://www.npmjs.com/package/tessellate-fragment)

## Installation

You can install the bundler and fragment with npm:

```
npm install tessellate-bundler tessellate-fragment
```

See the rest of the documentation for details on each component. Let's start by looking at Tessellate's [architecture](Architecture.md)!

## License

© 2016-2017 Zalando SE. Released under the MIT license
