## Mosaic project

Mosaic is a set of services for complex and modular websites. It includes Fragments, a layout service and a router. See https://www.mosaic9.org.

## Fragment API

A Mosaic fragment is a microservice which renders some partial HTML of a larger composition, i.e. a website. It also returns an HTTP header with links to additional CSS and JavaScript files. Fragments are composed by the [Tailor](https://github.com/zalando/tailor) layout service.
