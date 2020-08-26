USAGE="Usage: $0 <version>"

if [ "$#" == "0" ]; then
  echo "$USAGE"
  exit 1
fi

set -e -x

# Setup Build
VERSION="$1"
PROJECT_NAME="example-plugin"
BUILD_DIR="$PWD/build"
DIST_DIR="$PWD/dist"

FILES="LICENSE.md
README.md
example/
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
mkdir -p "$DEPS_DIR"
python3.8 -m pip download -d "$DEPS_DIR" -r requirements.txt


# Initialize React
npm --prefix static/ install
npm --prefix static/ run build


cd "$BUILD_HOME" && tar -czvf "$DIST_DIR/$BUILD_NAME.tar.gz" . && cd - 1> /dev/null
