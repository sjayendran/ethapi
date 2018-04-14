Express & ES6 REST API Boilerplate
==================================

Built using the ES6 RESTful Express API Template:
https://github.com/developit/express-es6-rest-api

Ethereum API assignment for Keyrock.

API Routes
----------

```sh

#Generates a new Ethereum wallet and return and object with the private key and the public ETH address
GET /createWallet 

#Get the balance of an ethereum address
GET /getBalance/:param 

#Creates a transaction to send ETH from one address to another. It can receive 3 raw JSON params: privateKey of the source ETH address, destination is the ETH destination address and amount the number of ETH to be send.
POST /transaction {privateKey, destination, amount}

```

Getting Started
---------------

```sh
# clone it
git clone git@github.com:skullncode/ethapi.git
cd ethapi

# Install dependencies
npm install

# Start server
npm start

```
License
-------

MIT
