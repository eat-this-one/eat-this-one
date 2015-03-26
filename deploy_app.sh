#!/bin/bash

set -e

if [ -z $1 ]; then
    echo "
HEY YOU! REMEMBER TO:
- Point config_frontend.js to the production server
- Add information in updateManager about the new version cool features

Run deploy_app.sh with a second argument after confirming it :)"
    exit 0
fi

# Build the app to dist/app compressing JS.
# TODO Include version bumps.
grunt build:prod

# The SSH key should be set.
scp -r dist/app/platforms/android/ant-build/MainActivity-debug-unaligned.apk \
    root@eat-this-one.com:/var/www/html/android.apk

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
