#!/bin/bash

set -e

# Install dependencies.
npm install
bower install

# Create cordova app and add dependencies.
cordova create dist/app "com.monllao.david.eatthisone" "Eat this one" --save-copy=public/shared-build

cd dist/app

# TODO: Other platforms
cordova platform add android

cordova plugin add org.apache.cordova.globalization
cordova plugin add org.apache.cordova.device
cordova plugin add https://github.com/phonegap-build/PushPlugin.git
cordova plugin add https://github.com/katzer/cordova-plugin-local-notifications.git
