#!/bin/bash

set -e

# We need $ADT_PATH here.
. development.properties

# ADT should already be in $PATH.
sudo $ADT_PATH/sdk/platform-tools/adb devices

grunt shell:deploy_app ; adb logcat -c ; adb logcat $1
