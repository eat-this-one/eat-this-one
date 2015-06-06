#!/bin/bash

set -e

if [ -z $1 ]; then
    echo "Error: We need an argument, android or ios"
    exit 1
fi

if [ "$1" != "android" -a "$1" != "ios" ]; then
    echo "Error: \$1 should be android or ios"
    exit 1
fi

# We only allow 1 platform to be installed.
if [ -f "dist/app/config.xml" ]; then
    echo "Error: Already installed."
    exit 1
fi

# Checking that the SDK is installed.
if [ "$1" == "android" ]; then
    if [ -z "$ANDROID_HOME" ]; then
        echo "Error: You must install Android SDK and ANDROID_HOME env var set be set before you can continue."
        exit 1
    fi
fi

# Include mobile app vars.
if [ ! -f "config/project.properties" ]; then
    cp config/project.properties.dist config/project.properties
fi

# Load the config.
. config/project.properties

# Copy the dist config files.
if [ ! -f "config/frontend.js" ]; then
    cp config/frontend.js.dist config/frontend.js
fi
if [ ! -f "config/backend.js" ]; then
    cp config/backend.json.dist config/backend.json
fi

unamestr=`uname`
if [ "$unamestr" == "Darwin" ]; then
    sedcmd="sed -i ''"
else
    sedcmd="sed -i"
fi

# Install project dependencies.
bower install
npm install
node node_modules/protractor/bin/webdriver-manager update

if [ ! -d "dist" ]; then
    mkdir -p dist/app
fi

if [ ! -d "public/shared-build" ]; then
    mkdir public/shared-build
fi

# Create cordova app and add dependencies.
cordova create dist/app "$PACKAGENAME.$1" "$APPNAME"

# Build the project to populate public/shared-build and friends.
grunt build:dev

# App icons.
if [ ! -d "dist/app/res" ]; then
    mkdir -p dist/app/res
fi
ln icons/* dist/app/res

cd dist/app

# TODO I'm tired of dealing with ios resources not reading the
# filter or picking the wrong icon. Fix this at some point in a
# probably unexisting future.
if [ "$1" == "ios" ]; then
    ${sedcmd} 's#</widget>#\
    <icon src="res/icon-ios-60@3x.png" width="180" height="180" />\
    <icon src="res/icon-ios-60.png" width="60" height="60" />\
    <icon src="res/icon-ios-60@2x.png" width="120" height="120" />\
    <icon src="res/icon-ios-76.png" width="76" height="76" />\
    <icon src="res/icon-ios-76@2x.png" width="152" height="152" />\
    <icon src="res/icon-ios-40.png" width="40" height="40" />\
    <icon src="res/icon-ios-40@2x.png" width="80" height="80" />\
    <icon src="res/icon-ios.png" width="57" height="57" />\
    <icon src="res/icon-ios@2x.png" width="114" height="114" />\
    <icon src="res/icon-ios-72.png" width="72" height="72" />\
    <icon src="res/icon-ios-72@2x.png" width="144" height="144" />\
    <icon src="res/icon-ios-small.png" width="29" height="29" />\
    <icon src="res/icon-ios-small@2x.png" width="58" height="58" />\
    <icon src="res/icon-ios-50.png" width="50" height="50" />\
    <icon src="res/icon-ios-50@2x.png" width="100" height="100" />\
    <splash src="res/splash-ios.png" width="320" height="480"/>\
    <splash src="res/splash-ios@2x.png" width="640" height="960"/>\
    <splash src="res/splash-ios-portrait.png" width="768" height="1024"/>\
    <splash src="res/splash-ios-portrait@2x.png" width="1536" height="2048"/>\
    <splash src="res/splash-ios-landscape.png" width="1024" height="768"/>\
    <splash src="res/splash-ios-landscape@2x.png" width="2048" height="1536"/>\
    <splash src="res/splash-ios-568h@2x.png" width="640" height="1136"/>\
    <splash src="res/splash-ios-667h@2x.png" width="750" height="1334"/>\
    <splash src="res/splash-ios-736h@2x.png" width="1242" height="2208"/>\
    <splash src="res/splash-ios-landscape-736h@3x.png" width="2208" height="1242"/>\
    <platform name="ios">\
        <preference name="EnableViewportScale" value="true"/>\
    </platform>\
    </widget>#' config.xml
else
    ${sedcmd} 's#</widget>#\
    <icon src="res/icon-android.png" />\
    <icon src="res/icon-android.png" density="ldpi" />\
    <icon src="res/icon-android.png" density="mdpi" />\
    <icon src="res/icon-android.png" density="hdpi" />\
    <icon src="res/icon-android.png" density="xhdpi" />\
    <splash src="res/splash-android-portrait.png" density="hdpi"/>\
    <splash src="res/splash-android-portrait.png" density="ldpi"/>\
    <splash src="res/splash-android-portrait.png" density="mdpi"/>\
    <splash src="res/splash-android-portrait.png" density="xhdpi"/>\
    <splash src="res/splash-android-portrait.png" density="port-hdpi"/>\
    <splash src="res/splash-android-portrait.png" density="port-ldpi"/>\
    <splash src="res/splash-android-portrait.png" density="port-mdpi"/>\
    <splash src="res/splash-android-portrait.png" density="port-xhdpi"/>\
    <splash src="res/splash-android-landscape.png" density="land-hdpi"/>\
    <splash src="res/splash-android-landscape.png" density="land-ldpi"/>\
    <splash src="res/splash-android-landscape.png" density="land-mdpi"/>\
    <splash src="res/splash-android-landscape.png" density="land-xhdpi"/>\
    </widget>#' config.xml

fi
# Setting minimum supported versions. Android API 16 (no PushPlugin GET_ACCOUNTS permission) & IOS 6.
${sedcmd} 's#</widget>#\
    <preference name="android-minSdkVersion" value="16" />\
    <preference name="deployment-target" value="6.0" />\
    <preference name="Fullscreen" value="false" />\
</widget>#' config.xml

# Sets version, description, author...
${sedcmd} "s#<widget id=\"$PACKAGENAME.$1\" version=\"0.0.1\"#<widget id=\"$PACKAGENAME.$1\" version=\"$VERSION\"#" config.xml
${sedcmd} "s#<author.*>#<author email=\"$AUTHOR_EMAIL\" href=\"$AUTHOR_WEBSITE\">#" config.xml
${sedcmd} "s#Apache Cordova Team#$AUTHOR_NAME#" config.xml
${sedcmd} "s#A sample Apache Cordova application that responds to the deviceready event.#$DESCRIPTION#" config.xml
${sedcmd} 's#<access.*>#\
    <access origin="'$BACKEND_URL'" />\
    <access origin="http://*.eat-this-one.com" />\
    <access origin="https://*.eat-this-one.com" />\
    <access origin="http://*.gravatar.com" />\
    <access origin="https://*.gravatar.com" />#' config.xml

# Only the required platform.
cordova platform add "$1"

# Install all plugins.
while read -a plugin; do
    cordova plugin add ${plugin[1]}
done < ../../cordova-plugins.list

# Build again so we are ready to deploy apps.
grunt build:dev
