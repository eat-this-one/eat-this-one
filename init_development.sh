#!/bin/bash

set -e

# Load config
. ./development.properties

sudo $ADT_PATH/sdk/platform-tools/adb devices
grunt run:dev
