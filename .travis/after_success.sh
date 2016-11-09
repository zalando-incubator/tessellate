#!/usr/bin/env bash
# https://github.com/atlassian/lerna-semantic-release/blob/caribou/.travis/after_success.sh

set -e

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "We are in a pull request, not releasing"
  exit 0
fi

if [[ "$TRAVIS_BRANCH" == "master" ]]; then
  openssl aes-256-cbc -K $encrypted_987335dd518e_key -iv $encrypted_987335dd518e_iv -in .travis/deploy_key.enc -out deploy_key -d
  chmod 600 deploy_key
  eval `ssh-agent -s`
  ssh-add deploy_key

  npm run semantic-release
fi
