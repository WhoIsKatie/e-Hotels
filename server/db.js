/** database adapter file
 * sets up connection to the PostgreSQL database, e-Hotels
 */

const Pool = require("pg").Pool;

const pool = new Pool({
	user: "postgres",
	password: "admin",
	host: "localhost",
	port: 5432,
	database: "e-Hotels",
});

module.exports = pool;
