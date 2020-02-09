#!/bin/bash

# this is for cygwin

# Build server
echo 'Building server...'
pyinstaller.exe -F -n war3observer war3observer/__main__.py

# Build client
echo 'Building client...'
cd client
npm install
npm run build
cd ..
mkdir -p dist/client
cp -R client/dist/. dist/client/

# Build icons
echo 'Extracting icons from WC3 installation...'
mkdir -p dist/client/icons/hd
python.exe tools/extract_icons.py "$1" dist/client/icons/

# Archive
echo 'Packaging release...'
cd dist
cp ../README.md .
cp ../LICENSE .
zip -r "../war3observer-win-$(uname -m)-$(head -n 1 ../war3observer/__init__.py | grep -Po '(\d+\.\d+\.\d+)').zip" ./*
