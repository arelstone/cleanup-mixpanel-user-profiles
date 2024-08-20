#!/usr/bin/env bash
node all.js

for file in __generated__/*.json; do
    path="$(realpath)/$file"
    curl -X POST -H "Content-Type: application/json" -d @$path https://api-eu.mixpanel.com/engage?strict=1#profile-unset
done
