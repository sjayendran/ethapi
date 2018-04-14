const Web3 = require('web3');
const Accounts = require('web3-eth-accounts');
const EthTx = require('ethereumjs-tx')
const ethUtilLib = require('ethereumjs-util');

const testnetURI = "https://rinkeby.infura.io/8IGObntlVoaKczCsmAak";

const web3 = new Web3(new Web3.providers.HttpProvider(testnetURI));

//Get balance of Ethereum TEST NET Rinkeby Address
export const getBalance = (etthaddr, resp) => {
    try{
        return web3.eth.getBalance(etthaddr).then(bal => {
            return Web3.utils.fromWei(bal, 'ether');
        });
    }
    catch(err){
        throw err;
    }
};

//Create Ethereum Wallet on TEST NET Rinkeby
export const createWallet = () => {
    const web3Accounts = new Accounts(testnetURI);
    let walletDetails = web3Accounts.create();
    return walletDetails;
};

//Execute Transaction between two Ethereum addresses using 
//the source private key and the destination address
export const postTransaction = (fromPrivKey, toEthAddr, amount, resp) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(testnetURI));
    let privateKey = new Buffer(fromPrivKey, 'hex');
    let derivedFromAddress = '0x' + ethUtilLib.privateToAddress(privateKey).toString('hex');
    
    if(validAddress(derivedFromAddress) && validAddress(toEthAddr)){
        return web3.eth.getTransactionCount(derivedFromAddress).then(txCount => {
            let nonceForTx = web3.utils.toHex(txCount);
            let rawTx = {
                nonce: nonceForTx,
                to: toEthAddr,
                gasPrice: web3.utils.toHex(21e9),//getGasPrice()),
                gasLimit: web3.utils.toHex(21000),
                value: web3.utils.toHex(web3.utils.toWei(amount, "ether")),
                data: ''
            };
            
            let tx = new EthTx(rawTx);
            tx.sign(privateKey);
        
            let serializedTx = tx.serialize();
            
            return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
                .on('transactionHash', hash => {
                    console.log('%%% Got transaction HASH:');
                    console.log(hash);
                    return hash;
                })
                .on('error', error => { 
                    return error;
                })
                .on('confirmation', (confNumber, receipt) => { 
                    console.log("Confirmation #: " + confNumber);
                    return confNumber;
                }).then((receipt) => {
                    console.log("%%% Receipt mined:");
                    console.log(receipt);
                    return receipt;
                });
        }).catch(err => {
            respondWithError(err.toString(), resp);
            return null;
        });
    }
    else{
        throw new Error("Invalid Ethereum address; please check and try again!");
    }
};

const validAddress = (addr) => {
    addr = addr.replace("0x", "");
    return addr.length == 40;
}

const respondWithError = (errTxt, resp) => {
    resp.status(400).json({
        "status": "error",
        "error": errTxt
    });
}