## Hybrid local development server

This is a sample Node.js app that helps developing hybrid PWA Kit build locally.

This server is a reverse proxy that forward requests to two origins:

1. Remote origin (usually this is your SFRA site)
2. Local origin (usually this is your local PWA dev server)

It serves two sites under the same domain locally and enable developers to test hybrid deployment shopper flows.

### Get started
**Installation**
```sh
git clone https://gist.github.com/kevinxh/77f1cad926d84e938f7de55fdeb0535c hybrid-dev-server
cd hybrid-dev-server
npm install
```

**Update configuration**

Open index.js and change the following variables:

`SFRA_INSTANCE_ORIGIN` - The SFRA development instance URL.
`PWA_ORIGIN` - The PWA local development server URL.
`PWA_ROUTES` - The PWA routes.

**Run the server**
You need to make sure you have the PWA local development server running on another terminal tab.
```sh
npm start

# output: Proxy server listening: http://localhost:8001
```

Then open browser http://localhost:8001, you should have both the SFRA and PWA site running on the same domain.