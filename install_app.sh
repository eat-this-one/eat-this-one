#!/bin/bash

set -e

grunt shell:deploy_app ; adb logcat -c ; adb logcat $1
