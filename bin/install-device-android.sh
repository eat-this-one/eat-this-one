#!/bin/bash

set -e

if [ -z $ANDROID_HOME ]; then
    echo "Error: You must install Android SDK and ANDROID_HOME env var should be set before you can install the app in an android device."
    exit 1
fi

# We need $ANDROID_HOME here.
. config/project.properties

sudo $ANDROID_HOME/platform-tools/adb devices

cd dist/app
cordova run --device

# Clean logcat and start it again.
adb logcat -c ; adb logcat
