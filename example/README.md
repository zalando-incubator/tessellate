# tessellate-example

This example shows how to use tessellate-bundler and tessellate-fragment together with [Tailor](https://github.com/zalando/tailor).

## Setup

Compile the tessellate packages by running `yarn install` in the parent directory of the Tessellate project.
Next, install the dependencies of this example and start all the services:

```
yarn install
yarn start
```

## Usage

The following services will be started:

* tessellate-bundler (port 3001)
* tessellate-fragment (port 3003)
* Tailor (port 3005)

Now we can post content to tessellate-bundler:

```bash
./post_content.sh
```

This should create three separate bundles inside the `bundles/` directory.
Finally, we can open [http://localhost:3005/hello]() in a browser. Tailor should render the `hello.html` template.
