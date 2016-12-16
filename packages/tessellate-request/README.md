# tessellate-request

Auth support can be enabled by supplying `AUTH_CONFIGURATION` variable
to [tessellate-fragment](https://github.com/zalando-incubator/tessellate/tree/master/packages/tessellate-fragment).
upon startup.

`AUTH_CONFIGURATION` variable is an absolute path to an auth configuration file.
Currently only `file://` protocol is supported.

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

**id**: Auth configuration id. This must match with the id in sources configuration.
```
sources:
  properties:
    auth:
      id: <id>
```

**type**: Currently `OAUTH2_JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER` is supported.

**credentials_directory**: Absolute path to the credentials directory

**access_token_uri**: Where to get access tokens

**scopes**: OAuth scopes, space-separated. For example `scope1 scope2`
