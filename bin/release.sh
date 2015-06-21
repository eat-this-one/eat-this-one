#!/bin/bash

set -e

if [ -z $1 ]; then
    echo "
HEY YOU! BEFORE RUNNING THIS AGAIN:
# This script is used to push to production. You don't probably need to use this.
# Ensure you pulled the latest changes from the repo
# Run grunt build:test and ensure all is passing
# Copy or increase the version (look the current one in package.json and increment it).

Once done, run 'grunt release:X.Y.Z', where X.Y.Z is the version number (each point accepts 2 digits).
"
    exit 1
fi

unamestr=`uname`
if [ "$unamestr" == "Darwin" ]; then
    sedcmd="sed -i ''"
else
    sedcmd="sed -i"
fi

git remote show | grep dokku > /dev/null || \
    (echo "Error: This script is used to push to production.
If you don't have a dokku remote I doubt you should be running this." ; exit 1)

# Check that we are in master.
git branch | grep "* master" > /dev/null || \
    (echo "Error: Set the current branch to master." ; exit 1)

# Check that everything was commited.
test "$(git diff HEAD | wc -l)" == "0" || \
    (echo "Error: Commit everything before a release." ; exit 1)

if [ ! -z $1 ]; then

    version=$1

    if [[ ! $version =~ ^[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}$ ]]; then
        echo "Error: Check version value. Should be something like 2.13.10"
        exit 1
    fi

    # We should convert 1 digit parts to 2 digits.
    versionCode=$(echo $version | sed 's/\.\([0-9]\)\./\.0\1\./g')
    versionCode=$(echo $versionCode | sed 's/\.\([0-9]\)$/\.0\1/g')

    # Remove dots and cleaning leading zeros.
    versionCode=${versionCode//.}
    versionCode=$(echo $versionCode | sed 's/^0*//')

    # Check that versionCode is an integer.
    if [[ ! $versionCode =~ ^-?[0-9]+$ ]]; then
        echo "Error: Check version value. Should be something like 2.13.10. It has not been converted to an int correctly"
        exit 1
    fi
fi

if [ -z $version ]; then
    echo "Error: There is no version value"
    exit 1
fi

# These are bundled in the package.
${sedcmd} "s#VERSION=\"\(.*\)\"#VERSION=\"$version\"#" config/project.properties.dist
${sedcmd} "s#version *: *'\(.*\)'#version: '$versionCode'#" config/frontend.js.dist
${sedcmd} "s#\"version\" *: *\"\(.*\)\"#\"version\": \"$version\"#" package.json
${sedcmd} "s#\"version\" *: *\"\(.*\)\"#\"version\": \"$version\"#" bower.json

# These might not be there as they are generated.
if [ -f "config/frontend.js" ]; then
    ${sedcmd} "s#version *: *'\(.*\)'#version: '$versionCode'#" config/frontend.js
fi
if [ -f "dist/app/config.xml" ]; then
    ${sedcmd} "s#version=\"\(.*\)\" xmlns=#version=\"$version\" android-versionCode=\"$versionCode\" xmlns=#" dist/app/config.xml
fi
if [ -f "config/project.properties" ]; then
    ${sedcmd} "s#VERSION=\"\(.*\)\"#VERSION=\"$version\"#" config/project.properties
fi

# If there are version changes commit them and create a new tag in the repo.
git commit package.json bower.json config/frontend.js.dist config/project.properties.dist -m "Release $version" && \
git tag -a "v$version" -m "Release v$version" && \
git push origin "v$version"

# Push latest changes to the public server (NO -f HERE!).
git push origin master

# Push latest changes to backend server (NO -f HERE!).
git push dokku master

echo "
-------------------------------------------------------------------------------
DONE!
- Backend public server updated to v$version
- Version updated in package.json, bower.json, config/frontend.js, config/project.properties.dist
  (also in config/frontend.js.dist, config/project.properties and dist/app/config.xml if required)
- Tag v$version released if it didn't exist before
- Public repo master HEAD updated
"
exit 0
