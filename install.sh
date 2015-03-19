#!/bin/bash

set -e

packagename="org.eat-this-one.app"
appname="Eat this one!"

if [ -z $1 ]; then
    echo "Error: We need an argument, android or ios"
    exit 1
fi

if [ "$1" == "android" -a "$1" == "ios" ]; then
    echo "Error: 1 should be android or ios"
    exit 1
fi

# Update global dependencies.
sudo npm install -g grunt-cli
sudo npm install -g express
sudo npm install -g bower
sudo npm install -g express-generator
sudo npm install -g cordova

# I usually have problems with this...
npm prune ; npm cache clean ; sudo npm prune ; sudo npm cache clean

# Install project dependencies.
npm install
bower install

if [ ! -d "dist" ]; then
    mkdir -p dist/app
fi

if [ ! -d "public/shared-build" ]; then
    mkdir public/shared-build
fi

# Create cordova app and add dependencies.
cordova create dist/app "$packagename$1" "$appname"

# Build the project to populate public/shared-build and friends.
grunt build:dev

# App icon.
ln icon.png dist/app/icon.png

cd dist/app

# Only the required platform.
cordova platform add "$1"

# Install all plugins.
while read -a plugin; do
    cordova plugin add ${plugin[1]}
done < ../../cordova-plugins.list
