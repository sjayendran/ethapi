import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import {getBalance, createWallet, postTransaction} from '../lib/ethutils';

const Web3 = require('web3');

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));
	
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get('/getBalance/:ethaddr', (req, res) => {
		getBalance(req.params.ethaddr).then(bal => {
			let convertedBal = Web3.utils.fromWei(bal, 'ether');
			res.status(200).json({
				"status": "ok",
				"balance": convertedBal 
			});
		});
		//res.send("reached get balance method!");
	});

	api.get('/createWallet', (req, res) => {
		let walletDetails = createWallet();
		res.status(201).json({ 
			"status": "ok",
			walletDetails 
		});
	});

	api.post('/transaction', (req, res) => {
		postTransaction(req.body.privateKey, req.body.destination, req.body.amount, res).then(result => 
			{
				console.log("this is the result:");
				console.log(result);
				res.status(202).json({
					"status": "ok",
					"receipt": result
				});
			}
		);
	});

	return api;
}
