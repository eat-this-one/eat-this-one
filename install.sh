#!/bin/bash

set -e

packagename="org.eatthisone.app"
appname="Eat this one!"
author="David Monllao Olive"
email="support@eat-this-one.com"
website="http://www.eat-this-one.com"
backend="https://eat-this-one.com"
description="Share cooking specialties with your colleagues or classmates at lunch time."

if [ -z $1 ]; then
    echo "Error: We need an argument, android or ios"
    exit 1
fi

if [ "$1" != "android" -a "$1" != "ios" ]; then
    echo "Error: \$1 should be android or ios"
    exit 1
fi

# Grrrrr.
if [ "$1" == "ios" ]; then
    sedcmd="sed -i ''"
else
    sedcmd="sed -i"
fi

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

# Setting the app config.
# - Icons
# - Set minimum supported versions (Android API 14 & IOS 6)
# - No zoom
${sedcmd} 's#</widget>#\
    <icon src="icon.png" />\
    <platform name="ios">\
        <icon src="icon-ios.png" />\
        <splash src="splash.png" />\
        <preference name="EnableViewportScale" value="true"/>\
    </platform>\
    <preference name="android-minSdkVersion" value="14" />\
    <preference name="deployment-target" value="6.0" />\
    <preference name="Fullscreen" value="true" />\
</widget>#' config.xml

# Set description, author...
${sedcmd} "s#<author.*>#<author email=\"$email\" href=\"$website\">#" config.xml
${sedcmd} "s#Apache Cordova Team#$author#" config.xml
${sedcmd} "s#A sample Apache Cordova application that responds to the deviceready event.#$description#" \
config.xml
${sedcmd} 's#<access.*>#\
    <access origin="'$backend'" />\
    <access origin="http://gravatar.com" />\
    <access origin="https://gravatar.com" />#' config.xml

# Only the required platform.
cordova platform add "$1"

# Install all plugins.
while read -a plugin; do
    cordova plugin add ${plugin[1]}
done < ../../cordova-plugins.list
