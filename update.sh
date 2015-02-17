#!/bin/bash

set -e

# Update global dependencies.
sudo npm update grunt-cli -g
sudo npm update express -g
sudo npm update bower -g
sudo npm update express-generator -g
sudo npm update cordova -g

# Update project dependencies.
npm update
bower update

cd dist/app

# TODO: Other platforms.
cordova platform update android

# Update all plugins.
while read -a plugin; do
    cordova plugin rm ${plugin[0]}
    cordova plugin add ${plugin[1]}
done < ../../cordova-plugins.list
