const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// middleware
app.use(cors());
app.use(express.json());

// ROUTES

// insertion
app.post("/hotel_chain", async (req, res) => {
	try {
		const {
			name,
			street_num,
			street_name,
			unit_num,
			city,
			state,
			country,
			postal_code,
		} = req.body;

		const newChain = await pool.query(
			"INSERT INTO hotel_chain (name, street_num, street_name, unit_num, city, state, country, postal_code) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
			[
				name,
				street_num,
				street_name,
				unit_num,
				city,
				state,
				country,
				postal_code,
			]
		);

		res.json(newChain.rows[0]);
	} catch (error) {
		console.log(error.message);
	}
});

// get all
app.get("/hotel_chain", async (req, res) => {
	try {
		const allChains = await pool.query("SELECT * FROM hotel_chain");
		res.json(allChains.rows);
	} catch (error) {
		console.log(error.message);
	}
});

// get hotel_chain with chain_id
app.get("/hotel_chain/:chain_id", async (req, res) => {
	try {
		const { chain_id } = req.params;
		const chain = await pool.query(
			"SELECT * FROM hotel_chain WHERE chain_id = $1",
			[chain_id]
		);
		res.json(chain.rows[0]);
	} catch (error) {
		console.log(error.message);
	}
});

//update hotel_chain with chain_id
app.put("/hotel_chain/:chain_id", async (req, res) => {
	try {
		const { chain_id } = req.params;
		const {
			name,
			street_num,
			street_name,
			unit_num,
			city,
			state,
			country,
			postal_code,
		} = req.body;

		const newChain = await pool.query(
			"UPDATE hotel_chain SET name = $1 WHERE chain_id = $2",
			[name, chain_id]
		);
		res.json("hotel_chain name was updated!");
	} catch (error) {
		console.log(error.message);
	}
});

app.delete("/hotel_chain/:chain_id", async (req, res) => {
	try {
	} catch (error) {
		const { chain_id } = req.params;
		const deleteHotelChain = await pool.query(
			"DELETE FROM hotel_chain WHERE chain_id = $1",
			[chain_id]
		);
		res.json("hotel_chain was deleted!");
		console.log(error.message);
	}
});

app.listen(5000, () => {
	console.log("server has started on port 5000");
});
