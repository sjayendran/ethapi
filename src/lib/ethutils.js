const Web3 = require('web3');
const Accounts = require('web3-eth-accounts');
const EthTx = require('ethereumjs-tx')
const ethUtilLib = require('ethereumjs-util');

const testnetURI = "https://rinkeby.infura.io/8IGObntlVoaKczCsmAak";
const testWalletAddress = "0x72876955eFf70C37308d0a9411281c5a3A0BD729";
const web3 = new Web3(new Web3.providers.HttpProvider(testnetURI));

const timeoutDuration = 60000;

//Get balance of Ethereum TEST NET Rinkeby Address
export const getBalance = (etthaddr) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(testnetURI));    
    return web3.eth.getBalance(etthaddr).then(bal => {return bal;});
};

export const createWallet = () => {
    const web3Accounts = new Accounts(testnetURI);
    let walletDetails = web3Accounts.create();
    //console.log("%%%% this is the wallet details:");
    //console.log(walletDetails);
    return walletDetails;
};

export const postTransaction = (fromPrivKey, toEthAddr, amount, resp) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(testnetURI));
    console.log("reached post transaction: this is the obj:");

    console.log("%%%% going to derive the eth FROM address using only the private key:");
    let privateKey = new Buffer(fromPrivKey, 'hex');
    let derivedFromAddress = '0x' + ethUtilLib.privateToAddress(privateKey).toString('hex');
    console.log("%%%% this is the derived address:");
    console.log(derivedFromAddress);

    let txnObj = {
        "from": derivedFromAddress,
        "to": toEthAddr,
        "value": web3.utils.toHex(web3.utils.toWei(amount, "ether"))
    };
    console.log(txnObj);

    console.log("%%% will try sending transaction now");
    /*return web3.eth.sendTransaction({
        from: derivedFromAddress,
        to: toEthAddr,
        value: amount
    }).then(function(receipt){
        console.log("%%%% SUCCEESSFULLY SENT:");
        console.log(receipt);
        return receipt;
    });*/

    //getGasprice();

    /*let gasPriceToBeUsed = getGasPrice();//web3.utils.toHex(getGasPrice());
    console.log("%%% this is the gasprice that will be used:");
    console.log(gasPriceToBeUsed);*/

    /*let gasLimitToBeUsed = getGasLimit();
    console.log("%%% this is the GASLIMIT that will be used:");
    console.log(gasLimitToBeUsed);*/

    return web3.eth.getTransactionCount(derivedFromAddress).then(txCount => {
        console.log("%%% this is the txcount / nonce" + txCount);
        let nonceForTx = web3.utils.toHex(txCount);
        console.log("%%% this is the hex nonce:" + nonceForTx);

        let rawTx = {
            nonce: nonceForTx,//'0x0000000000000001',//web3.utils.toHex(web3.eth.getTransactionCount(derivedFromAddress)//'0x0000000000000002',//web3.utils.toHex(new Date().getTime()),//web3.utils.toHex(web3.eth.getTransactionCount(derivedFromAddress)),//'0x0000000000000001',//web3.utils.toHex(web3.eth.getTransactionCount(derivedFromAddress)),//'0x0000000000000000',//
            to: toEthAddr,
            gasPrice: web3.utils.toHex(21e9),//getGasPrice()),
            gasLimit: web3.utils.toHex(21000),
            value: web3.utils.toHex(web3.utils.toWei(amount, "ether")),
            data: ''
        };
    
        console.log("%%% THIS IS THE RAW TX:");
        console.log(rawTx);
    
        let tx = new EthTx(rawTx);
        tx.sign(privateKey);
    
        let serializedTx = tx.serialize();
        
        return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('transactionHash', hash => {
            console.log("reached transaction hash section");
            console.log(hash);
            return hash;
        })
        .on('receipt', receipt => { 
            console.log("%%% RECEIPT GOT: ");
            console.log(receipt);
            return receipt;
        })
        .on('error', error => { 
            console.log("%%%% GOT ERROR: "); 
            console.error(error);
            respondWithError(error, resp);
        })
        .on('confirmation', (confNumber, receipt) => { 
            console.log("%%% INSIDE CONFIRMATION block");
            console.log(confNumber);
            console.log(receipt); 
            return receipt;
        }).then((receipt) => {
            // will be fired once the receipt its mined
            //clearInterval(methodTimeoutInterval);
            console.log("%%% RECEIPT MINED: ");
            console.log(receipt);
            return receipt;
        });
    });
    

    //console.log("%%% THIS IS THE SERIALIZED TX:");
    //console.log(serializedTx.toString('hex'));

    //web3.eth.getBalance(derivedFromAddress).then(bal => {console.log("%%%% This is the balance in the FROM address: " + bal)});

    /*
    return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', receipt => {
        console.log("%%%% SUCCEESSFULLY SENT:");
        console.log(receipt);
        return receipt;
    });*/

    /*let nnc = web3.utils.toHex(getNonce(derivedFromAddress));
    console.log("%%% THI SIS THE NONCE:");
    console.log(nnc);*/
    
};

const respondWithError = (errTxt, resp) => {
    console.log("REQUEST TIMED OUT WILL RESPOND NOW!");
    let errorDescription = errTxt;
    
    if(errTxt){
        errorDescription = "Request Timed Out: " + errTxt;
    }
   
    resp.status(408).json({
        "status": "error",
        "error": errorDescription
    });
}

/*
const getGasPrice = () => {
    return web3.eth.getGasPrice().then(price => {
        return web3.utils.toHex(price);
    });
}

const getGasLimit = () => {
    return web3.eth.getBlock('latest').then(blk => {
        console.log("gasLimit: ");
        console.log(blk);
        return blk['gasLimit'];
    });
}

const getNonce = (srcAddress) => { 
    return web3.eth.getTransactionCount(srcAddress).then(txCount => {
        return txCount;
    });
};*/