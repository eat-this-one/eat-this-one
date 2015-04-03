#!/bin/bash

set -e

if [ -z $1 ]; then
    echo "
HEY YOU! REMEMBER TO:
- Point config_frontend.js to the production server
- Add information in updateManager about the new version cool features
- Change the version if required (look the current one and increment it).

Run deploy_app.sh with a second argument (android or ios) after confirming it :)

OPTIONS:
  \$1 => platform (android or ios).
  \$2 => version (no change if it is empty).
      e.g. \"1.2.3\"
"
    exit 1
fi

if [ "$1" != "android" -a "$1" != "ios" ]; then
    echo "Error: 1 should be android or ios"
    exit 1
fi

# Grrrrr.
if [ "$1" == "ios" ]; then
    sedcmd="sed -i ''"
else
    sedcmd="sed -i"
fi

if [ ! -z $2 ]; then

    version=$2

    # Clean the points and leading zeros.
    versionCode=${version//.}
    versionCode=$(echo $versionCode | sed 's/^0*//')

    # Check the strings length.
    if [ "${#version}" -ne "5" ]; then
        echo "Error: Check \$2 value. Should be something like 2.3.1"
        exit 1
    fi

    # Check that versionCode is an integer.
    if [[ ! $versionCode =~ ^-?[0-9]+$ ]]; then
        echo "Error: Check \$2 value. Should be something like 3.4.5"
        exit 1
    fi
fi

# Update the version and the versionCode.
if [ ! -z $version ]; then
    ${sedcmd} "s#version=\"\(.*\)\" xmlns#version=\"$version\" android-versionCode=\"$versionCode\" xmlns#" dist/app/config.xml
fi

# Build the app to dist/app compressing JS.
grunt build:prod

# Build the platform apps.
cd dist/app
cordova build $1
cd ../../

# TODO We will remove this once uploaded to Google Play.
# The SSH key should be already set.
if [ "$1" == "android" ]; then
    scp -r dist/app/platforms/android/ant-build/MainActivity-debug-unaligned.apk \
        root@eat-this-one.com:/var/www/html/android.apk
fi

# Push last changes to backend server (NO -f HERE!).
git push dokku master

echo "
-------------------------------------------------------------------------------
ALL DONE!
- Production app build ready
- http://www.eat-this-one.com/android.apk updated to last app release
- Backend updated to latest master

Now feel free to run ./install_app.sh to set the production app to your device."
exit 0
