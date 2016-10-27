#!/usr/bin/env bash
# https://github.com/atlassian/lerna-semantic-release/blob/caribou/.travis/before_install.sh

set -e

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "We are in a pull request, not setting up release"
  exit 0
fi

if [[ "$TRAVIS_BRANCH" == "master" ]]; then
  openssl aes-256-cbc -K $encrypted_987335dd518e_key -iv $encrypted_987335dd518e_iv -in .travis/deploy_key.enc -out deploy_key -d
  chmod 600 deploy_key
  eval `ssh-agent -s`
  ssh-add deploy_key

  rm -rf .git
  git init
  git clean -dfx
  git remote add origin git@github.com:$TRAVIS_REPO_SLUG.git
  git fetch origin
  git checkout $TRAVIS_BRANCH

  npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN -q
  npm prune

  git config --global user.email "$NPM_CONFIG_EMAIL"
  git config --global user.name "$NPM_CONFIG_EMAIL"
  git config --global push.default simple

  git fetch --tags
  git branch -u origin/$TRAVIS_BRANCH
fi
