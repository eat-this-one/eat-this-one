#!/bin/bash

set -e

# The SSH key should be set.
scp -r dist/app/platforms/android/ant-build/CordovaApp-debug-unaligned.apk \
    root@eat-this-one.com:/home/dokku/download/android.apk
