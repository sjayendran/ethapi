import { Router } from 'express';
import wallet from './wallet';

export default ({ config, db }) => {
	let api = Router();
		
	api.use('/', wallet);

	api.use(function (req, res) {
		res.status(404).send("Sorry, unable to find that route.");
	});

	return api;
}
