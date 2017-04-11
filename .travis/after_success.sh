#!/usr/bin/env bash
# https://github.com/atlassian/lerna-semantic-release/blob/caribou/.travis/after_success.sh
# http://stackoverflow.com/questions/18027115/committing-via-travis-ci-failing

set -e

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "We are in a pull request, not releasing"
  exit 0
fi

if [[ "$TRAVIS_BRANCH" == "master" ]]; then
  git config credential.helper "store --file=.git/credentials"
  echo "https://$RELEASE_GH_TOKEN:@github.com/$TRAVIS_REPO_SLUG.git" > .git/credentials

  git config --global user.email "maximilian.fellner@zalando.de"
  git config --global user.name "Maximilian Fellner"
  git config --global push.default simple

  npm config set //registry.npmjs.org/:_authToken=${NPM_TOKEN} -q
  npm prune

  npm run semantic-release
  npm run publish-docs
fi
