#!/bin/bash

set -e

if [ -z "$1" ]; then
    echo "
HEY YOU! BEFORE RUNNING THIS AGAIN:
# This script is used to sign the app. You don't probably need to use this.
# Ensure you pulled the latest changes from the repo
# Run all tests and ensure they are passing
# Clean the kitchen and commit everthing
# Ensure config/frontend.js GCM sender id is correctly set
# Check that config/frontend.js is pointing to https://eat-this-one.com/api backend
# You already ran grunt release:X.Y.Z to push changes to the repo

Once done, run 'grunt sign:android:/path/to/key.key'.
"
    exit 1
fi

if [ ! -f "dist/app/config.xml" ]; then
    echo "Error: You need to run grunt install:xxxx before. Check grunt --help options."
    exit 1
fi

git remote show | grep dokku > /dev/null || \
    (echo "Error: This script is used to sign the android app. If you don't have a dokku remote I doubt you should be running this." ; exit 1)


# Ensure the last www build is the production one.
grunt build:prod

# Returning to the project root directory, as the keystore file was specified from there.
cd dist/app
cordova build android --release
cd ../../

apkfile=dist/app/platforms/android/ant-build/MainActivity-release-unsigned.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $1 $apkfile eat-this-one-key

# In the project root.
zipalign -v 4 $apkfile Eat-This-One.apk


echo "
Done!
- Current codebase built
- Android app generated, signed and compressed.

Now you can scp -r Eat-This-One.apk root@eat-this-one.com:/var/www/html/android.apk
"

exit 0


