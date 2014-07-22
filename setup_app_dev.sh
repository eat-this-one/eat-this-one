#!/bin/bash

set -e

cordova create dist/app "com.monllao.david.eatthisone" "Eat this one" --save-copy=public/shared-build

cd dist/app

cordova platform add android
// TODO: Other platforms

cordova plugin add org.apache.cordova.globalization
cordova plugin add org.apache.cordova.device
cordova plugin add https://github.com/phonegap-build/PushPlugin.git
