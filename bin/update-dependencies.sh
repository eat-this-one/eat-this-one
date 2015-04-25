#!/bin/bash

##
# Be careful, after running this all should
# be properly tested or we will break a lot
# of stuff.
##

set -e

if [ ! -f "dist/app/config.xml" ]; then
    echo "Error: You need to install before updating something."
    exit 1
fi

# Update project dependencies and install new packages
# if package.json has been updated.
bower update
bower install
npm update
npm install
node node_modules/protractor/bin/webdriver-manager update

cd dist/app

# There is no need to ask again for the platform, just try
# to update both of them.
cordova platform update android || cordova platform update ios

# Update all plugins.
while read -a plugin; do
    cordova plugin rm ${plugin[0]}
    cordova plugin add ${plugin[1]}
done < ../../cordova-plugins.list

# Update generated apps.
grunt build:dev
