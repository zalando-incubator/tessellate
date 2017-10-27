#!/usr/bin/env bash

# Clean existing bundles
rm -rf tessellate/packages/tessellate-bundler/bundles

# POST header
curl -X "POST" "http://localhost:3001/bundles/zalando.de/header" \
     -H "Content-Type: application/json" \
     -d @content/header.json

# POST body
curl -X "POST" "http://localhost:3001/bundles/zalando.de/body" \
     -H "Content-Type: application/json" \
     -d @content/body.json

# POST footer
curl -X "POST" "http://localhost:3001/bundles/zalando.de/footer" \
     -H "Content-Type: application/json" \
     -d @content/footer.json
