import { version } from '../../package.json';
import { Router } from 'express';
import {getBalance, createWallet, postTransaction} from '../lib/ethutils';

const walletAPI = Router();

walletAPI.get('/', (req, res) => {
    res.json({ version });
});

//Route to get the balance of the supplied Ethereum address
walletAPI.get('/getBalance/:ethaddr', (req, res) => {
    console.log('inside get balance route:');
    console.log(req.params.ethaddr);
    try{
        getBalance(req.params.ethaddr).then(bal => {
            res.status(200).json({
                "status": "ok",
                "balance": bal 
            });
        });
    }
    catch(err){
        res.status(400).json({
            "status": "error",
            "error": err.toString()
        });
    }
});

//Route to create a new Ethereum wallet with Private Key & Public Address
walletAPI.get('/createWallet', (req, res) => {
    const walletDetails = createWallet();
    res.status(201).json({ 
        "status": "ok",
        walletDetails 
    });
});

//Route to send Ether from one Ethereum source address to another destination address
walletAPI.post('/transaction', (req, res) => {
    try{
        postTransaction(req.body.privateKey, req.body.destination, req.body.amount).then(result => 
            {	if(result !== null){
                    res.status(200).json({
                        "status": "ok",
                        "receipt": result
                    });
                }
            }
        ).catch(err => {
            // err can be logged here instead of exposing it from the API
            res.status(400).json({
                "status": "error",
                "error": err.toString()
            });
        });
    }
    catch(err){
        res.status(400).json({
            "status": "error",
            "receipt": err.toString()
        });
    }
});

export default walletAPI;