# WebRTC Video/Audio Broadcast

WebRTC PeerToPeer broadcast application that allows the broadcaster to send video and audio stream to all connected users (watchers). 

## Getting started

### Starting the application

Start the application using Node:

```bash
# Install dependencies for server
npm install

# Run the server
node server
```

### Testing the application

The application should now be running on your localhost:3000.

### Google auth

Create a project and new OAuth 2.0 Client IDs for your application in Google developer console. (https://console.developers.google.com/). Remember to add authorised JavaScript origins to all your environments.

Add your client id to `server.js` variable CLIENT_ID.

After setting up the authenticator, add permitted broadcaster emails to broadcaster.txt

### Configuring a self-hosted TURN-server

Using video call outside local network requires hosting and configuring a TURN server. 

In your server, allow traffic to the port you choose (in this case 12779). Install and configure coturn using following commands

```
sudo apt-get update
sudo apt-get install coturn
turnserver --listening-port 12779 --user testuser:testpassword --external-ip PUBLIC_CLOUD_IP/PRIVATE_CLOUD_IP --realm DOMAIN_OR_PUBLIC_IP --verbose

```

Configure your TURN credentials to BroadcastContainer and ViewContainer.

### Testcafe

Testcafe test for this repository can be executed with command 

```
testcafe chrome src/Tests/*
```

## Authors

Anna Suo-Anttila, Jermu Toiviainen, Kim Milan, Shujun Liu, Ville Mannila

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
