#!/bin/sh
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
rm -r silverstreaming-deploy-branch
wget https://github.com/silverbullettuni/silverstreaming/archive/deploy-branch.tar.gz
tar -zxvf deploy-branch.tar.gz
rm deploy-branch.tar.gz
cd silverstreaming-deploy-branch
docker build --tag node_server . -f Dockerfile_server
docker build --tag ui . -f Dockerfile_ui
docker run -d -p 4000:4000 -t node_server
docker run -d -p 3000:3000 -t ui

