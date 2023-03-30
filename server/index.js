/** Creates the express application to support database routing
 *
 */

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// middleware
app.use(cors());
app.use(express.json());

// data generator >:)
/* app.post("/room", async (req, res) => {
	try {
		//const meow = Math.floor(Math.random() * 10);
		for (let i = 1; i <= 40; ++i) {
			const rating = await pool.query(
				"SELECT rating FROM hotel WHERE hotel_id = $1",
				[i]
			);

			var rooms = [];
			var base = 50,
				incr = 10;
			switch (rating.rows[0].rating) {
				case 2:
					rooms.push(
						{ cap: 1, max: 2, amenities: 2 },
						{ cap: 1, max: 2, amenities: 2 },
						{ cap: 2, max: 3, amenities: 1 },
						{ cap: 2, max: 3, amenities: 2 },
						{ cap: 2, max: 4, amenities: 4 },
						{ cap: 2, max: 4, amenities: 4 }
					);
					break;
				case 3:
					rooms.push(
						{ cap: 1, max: 2, amenities: 2 },
						{ cap: 1, max: 2, amenities: 2 },
						{ cap: 2, max: 3, amenities: 2 },
						{ cap: 2, max: 3, amenities: 2 },
						{ cap: 2, max: 4, amenities: 4 },
						{ cap: 2, max: 8, amenities: 6 }
					);
					base = 79;
					incr = 15;
					break;

				case 4:
					rooms.push(
						{ cap: 1, max: 2, amenities: 2 },
						{ cap: 1, max: 2, amenities: 3 },
						{ cap: 2, max: 3, amenities: 2 },
						{ cap: 2, max: 4, amenities: 5 },
						{ cap: 2, max: 8, amenities: 6 },
						{ cap: 2, max: 8, amenities: 6 }
					);
					base = 219;
					incr = 40;
					break;
				case 5:
					rooms.push(
						{ cap: 1, max: 2, amenities: 3 },
						{ cap: 1, max: 2, amenities: 5 },
						{ cap: 2, max: 3, amenities: 3 },
						{ cap: 2, max: 4, amenities: 7 },
						{ cap: 2, max: 8, amenities: 7 },
						{ cap: 2, max: 8, amenities: 10 }
					);
					base = 999;
					incr = 100;
					break;
			}
			var roomNum = 1;
			for (let r of rooms) {
				await pool.query(
					"INSERT INTO room(room_number, hotel_id, price, capacity, max_capacity) VALUES($1, $2, $3, $4, $5)",
					[
						roomNum,
						i,
						base + r.cap * incr + (r.amenities * incr) / 2,
						r.cap,
						r.max,
					]
				);
				++roomNum;
			}
		}
	} catch (error) {
		console.log(error.message);
	}
}); */

// -*-*-*-*-*-*-*-*-*- ROUTES (queries) -*-*-*-*-*-*-*-*-*-

// insertion
app.post("/booking", async (req, res) => {
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
app.get("/booking", async (req, res) => {
	try {
		const allChains = await pool.query("SELECT * FROM hotel_chain");
		res.json(allChains.rows);
	} catch (error) {
		console.log(error.message);
	}
});

// get hotel_chain with chain_id
app.get("/booking/:booking_id", async (req, res) => {
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
app.put("/booking/:booking_id", async (req, res) => {
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

app.delete("/booking/:booking_id", async (req, res) => {
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
