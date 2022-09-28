nvm use 12

npm run build -- --c=release  

cp USER_README.md release/README.md

if [ ! -f ./user_paths.sh ]; then
    echo "user_paths.sh file not found."
fi

. ./user_paths.sh

if [ "$XML_DATA_FOLDER" ]; then
    cp -r $XML_DATA_FOLDER release/assets/data
    echo "xml data folder copied in dist."
fi

if [ "$CONFIG_FOLDER" ]; then
    cp -r $CONFIG_FOLDER release/assets/
    echo "config folder copied in dist."
fi