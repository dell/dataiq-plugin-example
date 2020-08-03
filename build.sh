USAGE="Usage: $0 <version>"

if [ "$#" == "0" ]; then
  echo "$USAGE"
  exit 1
fi

# Setup Build
VERSION="$1"
PROJECT_NAME="example-plugin"
BUILD_DIR="build"
DIST_DIR="dist"

FILES="LICENSE.md
README.md
static/
templates/
app.py
startup.sh"


# Start Build
BUILD_NAME="$PROJECT_NAME-$VERSION"
BUILD_HOME="$BUILD_DIR/$BUILD_NAME"
mkdir -p "$BUILD_HOME"
mkdir -p "$DIST_DIR"


# Copy Regular Files to build dir.
cp -r $FILES "$BUILD_HOME"


# Pull Dependencies
DEPS_DIR="$BUILD_HOME/deps"
mkdir "$DEPS_DIR"
python3.8 -m pip download -d "$DEPS_DIR" -r requirements.txt


# Initialize React
# TODO @Eric J - for example Erik does not know how to get /static/dist/bundle.js in place.
#  You may assume that the build machine has Node, etc, installed. We just need the commands
#  to get from a clean repo state (say from a fresh git clone) to ready for use.


tar -czvf "$DIST_DIR/$BUILD_NAME.tar.gz" -C "$BUILD_DIR" "$BUILD_NAME"