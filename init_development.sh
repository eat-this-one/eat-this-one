#!/bin/bash

set -e

# ADT should already be in $PATH.
sudo adb devices

grunt run:dev
