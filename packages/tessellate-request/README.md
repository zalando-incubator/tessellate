# tessellate-request

OAuth support can be enabled by supplying `OAUTH_CONFIGURATIONS_FILE` variable
to [tessellate-fragment](https://github.com/zalando-incubator/tessellate/tree/master/packages/tessellate-fragment).
upon startup.

`OAUTH_CONFIGURATIONS_FILE` variable is an absolute path to an OAuth configuration file.

The configuration file must be of the following format:

```
[
  {
    id: string,
    type: string,
    credentials_directory: string,
    access_token_uri: string,
    scopes: string
  }
]
```

**id**: OAuth configuration id. This must match with the id in sources configuration.
```
sources:
  properties:
    auth:
      id: <id>
```

**type**: Currently `JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER` is supported.

**credentials_directory**: Absolute path to the credentials directory

**access_token_uri**: Where to get access tokens

**scopes**: OAuth scopes, space-separated. For example `scope1 scope2`
