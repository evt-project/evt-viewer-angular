# Requires the Node version supported by Angular (^18.19.1 || ^20.11.1 || >=22): the Angular CLI stops otherwise

# Start from an empty folder, so that files removed from src/assets don't survive in the release
rm -rf release

npm run build -- --c=release || exit 1

# Angular can't copy assets outside its outputPath (release/core), so favicon and assets are copied here
cp src/favicon.ico release/
tar -C src -cf - --exclude=assets/data --exclude=assets/scss --exclude=assets/fonts/evt-icons-project.json assets | tar -C release -xf -

cp USER_README.md release/README.md

if [ ! -f ./user_paths.sh ]; then
    echo "user_paths.sh file not found."
fi

. ./user_paths.sh

if [ "$XML_DATA_FOLDER" ]; then
    cp -r $XML_DATA_FOLDER release/assets/
    echo "xml data folder copied in release."
fi

if [ "$CONFIG_FOLDER" ]; then
    cp -r $CONFIG_FOLDER release/assets/
    echo "config folder copied in release."
fi

if [ "$EXAMPLES_README" ]; then
    cp $EXAMPLES_README release/EXAMPLES_README.md
    echo "Examples README copied in release."
fi
