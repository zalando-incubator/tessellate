![Tessellate](https://media.github.bus.zalan.do/user/115/files/7af8ba6e-91f8-11e6-854d-0e3ce4d4a3e0)

[Tessellate](https://github.com/zalando-incubator/tessellate) is a server-side React renderer that creates static HTML and a complementary component tree from abstract JSON definitions.

Tessellate implements the Fragment API of the Mosaic project. With Tessellate you can create *dynamic Fragments* that dynamically render results based on the context of each HTTP request.

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
