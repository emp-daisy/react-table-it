#!/bin/sh

[ ! -z "$GH_NAME" ] && git config user.name "$GH_NAME"
[ ! -z "$GH_EMAIL" ] && git config user.email "$GH_EMAIL"

MAIN_BRANCH=$(git symbolic-ref --short HEAD)
DIST="${1:-dist}";

git stash
git branch --delete --force gh-pages
git checkout --orphan gh-pages
git add -f $DIST
git commit -m "Build GitHub pages"
git filter-branch -f --prune-empty --subdirectory-filter $DIST && git push -f origin gh-pages
git checkout $MAIN_BRANCH
git stash apply || :