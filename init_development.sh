#!/bin/bash

set -e

. development.properties

# ADT should already be in $PATH.
sudo $ADT_PATH/sdk/platform-tools/adb devices

grunt run:dev
