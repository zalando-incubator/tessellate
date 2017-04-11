---
description: Documentation of tessellate-fragment.
---

# tessellate-fragment

Tessellate fragment is a web service that renders precompiled JavaScript bundles of React components to static HTML. It implements the Mosaic Fragment API and can be composed together with other Fragments inside a [Tailor](https://github.com/zalando/tailor) template.

## API

tessellate-fragment listens for incoming traffic at its root endpoint `/` and uses HTTP request headers to decide what response to serve.

## Resource fetching

The fragment fetches two kinds of input for the rendering step: a precompiled bundle and some optional external properties (content).

The source for bundles can be configured using the `BUNDLES_SOURCE` environment variable or with the `sources` query parameter the fragment tag's `src` attribute. The first one must be an HTTP address (e.g. https://myserver.com) that represents the base to resolve individual bundles. The seconds one bust be an API endpoint that returns a JSON response with the following schema:

```typescript
{
  bundles: {
    src: string,
    path?: string,
    properties?: string
  }
}
```

Currently two different kinds of configuration for individual bundle resolution are supported:

* Dynamic by HTTP headers: `x-zalando-request-uri` and `x-zalando-request-host` are used.
* Static: The configured base address is the only one.

The fragment then fetches two files `index.js` and `index.css` from the remote location, e.g. `https://myserver.com/test.com/mysite/index.js` (with dynamic resolution) or `https://myserver.com/index.js` (with static resolution).

If the `sources` query parameter was used, the `properties` attribute in the API response is used to fetch additional properties (content) that are going to be injected into the React components at render time.

## Further information

See [Configuration](Configuration.md#tessellate-fragment) for details on how to configure tessellate-fragment.
