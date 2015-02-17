#!/bin/bash

set -e

# Install global dependencies.
sudo npm install grunt-cli -g
sudo npm install express -g
sudo npm install bower -g
sudo npm install express-generator -g
sudo npm install cordova -g

# Install project dependencies.
npm install
bower install

# Create cordova app and add dependencies.
cordova create dist/app "com.monllao.david.eatthisone" "Eat this one" --copy-from=public/shared-build

# App icon.
ln icon.png dist/app/icon.png

cd dist/app

# TODO: Other platforms.
cordova platform add android

# Install all plugins.
while read -a plugin; do
    cordova plugin add ${plugin[1]}
done < ../../cordova-plugins.list
