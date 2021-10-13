#!/bin/sh -e

ng build --configuration production
mkdir -p dist/materials-browser-front
cp -r ../materials-browser-api dist/materials-browser-front/api | true
cd dist/materials-browser-front/api
rm -rf .idea .gitlab-ci.yaml .gitignore .git var nbproject
cd ..
zip -r materials-browser.zip *
