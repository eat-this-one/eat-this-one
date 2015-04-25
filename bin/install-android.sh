#!/bin/bash

set -e

if [ -z $ANDROID_HOME ]; then
    echo "Error: You must install Android SDK and set ANDROID_HOME env var before you can install the app in an android device."
    exit 1
fi

# We need $ANDROID_HOME here.
. development.properties

sudo $ANDROID_HOME/platform-tools/adb devices

cd dist/app
cordova run --device

# Clean logcat and start it again.
adb logcat -c ; adb logcat
