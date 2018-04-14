import { Router } from 'express';
//import facets from './facets';
import wallet from './wallet';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource - DEFAULT unused resource that came with the template
	//api.use('/facets', facets({ config, db }));
	
	api.use('/', wallet);

	return api;
}
