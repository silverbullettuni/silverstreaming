#!/bin/sh
sudo docker stop $(docker ps -aq)
sudo docker rm $(docker ps -aq)
rm -r silverstreaming-deploy-branch
wget https://github.com/silverbullettuni/silverstreaming/archive/deploy-branch.tar.gz
tar -zxvf deploy-branch.tar.gz
rm deploy-branch.tar.gz

cp reactcert/61619066_silverstream.dy.fi3000.cert silverstreaming-deploy-branch/cert.cert
cp reactcert/61619066_silverstream.dy.fi3000.key silverstreaming-deploy-branch/key.key


cd silverstreaming-deploy-branch
sudo docker build --tag node_server . -f Dockerfile_server
sudo docker build --tag ui . -f Dockerfile_ui
sudo docker run -d -p 4000:4000 -t node_server
sudo docker run -d -p 3000:3000 -t ui

