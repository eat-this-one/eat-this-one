#!/bin/bash

set -e

# Update global dependencies.
sudo npm update grunt-cli -g
sudo npm update express -g
sudo npm update bower -g
sudo npm update express-generator -g
sudo npm update cordova -g

# Update project dependencies and install new packages
# if package.json has been updated.
npm update
npm install
bower update

cd dist/app

# TODO: Other platforms.
cordova platform update android

# Update all plugins.
while read -a plugin; do
    cordova plugin rm ${plugin[0]}
    cordova plugin add ${plugin[1]}
done < ../../cordova-plugins.list
