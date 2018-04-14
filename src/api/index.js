import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import {getBalance, createWallet, postTransaction} from '../lib/ethutils';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));
	
	api.get('/', (req, res) => {
		res.json({ version });
	});

	//Handle blank parameter case for get balance route
	api.get('/getBalance/', (req, res) => {
		res.status(400).json({
			"status": "error",
			"error": "Please pass an Ethereum address as a parameter for the Get Balance REST route!"
		});
	});

	//Route to get the balance of the supplied Ethereum address
	api.get('/getBalance/:ethaddr', (req, res) => {
		console.log('inside get balance route:');
		console.log(req.params.ethaddr);
		try{
			getBalance(req.params.ethaddr, res).then(bal => {
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
	api.get('/createWallet', (req, res) => {
		let walletDetails = createWallet();
		res.status(201).json({ 
			"status": "ok",
			walletDetails 
		});
	});

	//Route to send Ether from one Ethereum source address to another destination address
	api.post('/transaction', (req, res) => {
		try{
			postTransaction(req.body.privateKey, req.body.destination, req.body.amount, res).then(result => 
				{	if(result !== null){
						res.status(202).json({
							"status": "ok",
							"receipt": result
						});
					}
				}
			)
		}
		catch(err){
			res.status(400).json({
				"status": "error",
				"receipt": err.toString()
			});
		}
	});

	return api;
}
