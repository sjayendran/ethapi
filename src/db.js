import mongoose from 'mongoose';

export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	const ethDBUri = "mongodb://ethadmin:Admin123@ds139219.mlab.com:39219/keyrockdb";
	let db = mongoose.createConnection(ethDBUri);
	callback(db);
}
