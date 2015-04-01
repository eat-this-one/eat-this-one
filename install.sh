#!/bin/bash

set -e

packagename="org.eatthisone.app"
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
cordova create dist/app "$packagename.$1" "$appname"

# Build the project to populate public/shared-build and friends.
grunt build:dev

# App icons.
ln icons/icon.png dist/app/icon.png
ln icons/icon-ios.png dist/app/icon-ios.png
ln icons/splash.png dist/app/splash.png

cd dist/app

# Adding icons.
sed -i '' 's#</widget>#    <icon src="icon.png" />\
    <platform name="ios">\
        <icon src="icon-ios.png" />\
        <splash src="splash.png" />\
    </platform>\
</widget>#g' config.xml

# TODO Set description and author (sed with multiline).

# Only the required platform.
cordova platform add "$1"

# Install all plugins.
while read -a plugin; do
    cordova plugin add ${plugin[1]}
done < ../../cordova-plugins.list
