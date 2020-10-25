#!/bin/sh
docker stop -t node_server
docker stop -t ui
docker rm -t node_server
docker rm -t ui
rm -r silverstreaming-deploy-branch
wget https://github.com/silverbullettuni/silverstreaming/archive/deploy-branch.tar.gz
tar -zxvf deploy-branch.tar.gz
rm deploy-branch.tar.gz
cd silverstreaming-deploy-branch
docker build --tag node_server . -f Dockerfile_server
docker build --tag ui . -f Dockerfile_ui
docker run -d -t node_server
docker run -d -t ui

