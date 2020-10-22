#!/bin/sh
kill -9 $(lsof -t -i:4000)
kill -9 $(lsof -t -i:8443)
rm -r silverstreaming-deploy-branch
wget https://github.com/silverbullettuni/silverstreaming/archive/deploy-branch.tar.gz
tar -zxvf deploy-branch.tar.gz
rm deploy-branch.tar.gz
cd silverstreaming-deploy-branch
npm install
node server
