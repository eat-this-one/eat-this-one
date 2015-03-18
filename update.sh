#!/bin/bash

set -e

if [ -z $1 ]; then
    echo "Error: We need an argument, android or ios"
    exit 1
fi

if [ "$1" != "android" -a "$1" != "ios" ]; then
    echo "Error: 1 should be android or ios"
fi

# Update global dependencies.
sudo npm update grunt-cli -g
sudo npm update express -g
sudo npm update bower -g
sudo npm update express-generator -g
sudo npm update cordova -g

# I usually have problems with this...
npm prune ; npm cache clean ; sudo npm prune ; sudo npm cache clean

# Update project dependencies and install new packages
# if package.json has been updated.
npm update
npm install
bower update
bower install

cd dist/app

# Only the required platform.
cordova platform update "$1"

# Update all plugins.
while read -a plugin; do
    cordova plugin rm ${plugin[0]}
    cordova plugin add ${plugin[1]}
done < ../../cordova-plugins.list
