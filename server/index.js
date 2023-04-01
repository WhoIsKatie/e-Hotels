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

// data generator
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

// -*-*-*-*-*-*-*-*-*- REGISTRATION ROUTE(query) -*-*-*-*-*-*-*-*-*-

app.put("/customer", async (req, res) => {
	try {
		const { sin, first, last } = req.body;
		const newPerson = await pool.query(
			"INSERT INTO person(sin, first_name, last_name) VALUES($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *",
			[sin, first, last]
		);

		if (person != null) {
			const newReg = await pool.query(
				"INSERT INTO registered (sin, registration_date) VALUES($1, CURRENT_DATE) ON CONFLICT ON CONSTRAINT registered_pkey DO NOTHING",
				[customer_sin]
			);
			if (req.body.hasOwnProperty("street_num")) {
				var query =
					"UPDATE registered SET street_num = $1, street_name = $2, city = $3, country = $4, postal_code = $5";

				if (req.body.hasOwnProperty("middle_name"))
					await pool.query(
						"UPDATE registered SET middle_name = $1 WHERE sin = $2",
						[req.body.middle_name, sin]
					);

				if (req.body.hasOwnProperty("unit"))
					query += ", unit = $6 WHERE sin = $7 ";
				else query += " WHERE sin = $6";

				const updatedReg = await pool.query(query);
				res.json(updatedReg);
			} else res.json(newReg);
		} else res.json(false);
	} catch (error) {
		console.log(error.message);
	}
});

// -*-*-*-*-*-*-*-*-*- BROWSING ROUTES (queries) -*-*-*-*-*-*-*-*-*-

app.get("/room", async (req, res) => {
	try {
		const { checkin_date, checkout_date } = req.body;
		var query =
			"SELECT * FROM available_rooms AS ar WHERE (NOT EXISTS(SELECT * FROM booking AS b WHERE b.room_number = room_number AND NOT (b.checkout_date <= date $1 OR b.checkin_date >= date $2)) OR NOT EXISTS(SELECT booking * FROM booking AS b WHERE (b.room_number = room_number))";
		var vals = [checkin_date, checkout_date];
		if (req.body.hasOwnProperty("capacity")) {
			vals.push(req.body.capacity);
			query += "AND max_capacity >= $" + vals.length;
		}

		if (req.body.hasOwnProperty("chain_name")) {
			vals.push(req.body.chain_name);
			query += "AND chain_name = $" + vals.length;
		}
		if (req.body.hasOwnProperty("rating")) {
			vals.push(req.body.rating);
			query += "AND rating = $" + vals.length;
		}
		if (req.body.hasOwnProperty("price")) {
			vals.push(req.body.price);
			query += "AND price <= $" + vals.length;
		}
		if (req.body.hasOwnProperty("country")) {
			if (req.body.hasOwnProperty("city")) {
				vals.push(req.body.city);
				query += "AND city = $" + vals.length;
			}
			vals.push(req.body.country);
			query += "AND country = $" + vals.length;
		}
		if (req.body.hasOwnProperty("hotel_rooms")) {
			vals.push(req.body.hotel_rooms);
			query +=
				"AND (SELECT COUNT(*) FROM available_rooms WHERE hotel_id = ar.hotel_id) >= $" +
				vals.length;
		}

		const booking = await pool.query(query, vals);
		res.json(booking.rows);
	} catch (error) {
		console.log(error.message);
	}
});

// -*-*-*-*-*-*-*-*-*- BOOKING/RENTING ROUTES (queries) -*-*-*-*-*-*-*-*-*-

/** route to insert new booking
 */
app.post("/booking", async (req, res) => {
	insertBooking(req, res);
});

/** route to insert new renting
 */
app.post("/renting", async (req, res) => {
	try {
		const { employee_sin, cc_number, expiry_date } = req.body;
		var books;
		// Checks if request includes the key-value pair for 'booking_id', otherwise create a new booking
		if (req.body.hasOwnProperty("booking_id")) {
			booking_id = req.body.booking_id;
			books = await pool.query(
				"SELECT * FROM books WHERE booking_id = $1",
				[booking_id]
			);
		} else books = insertBooking(req, res);

		await pool.query("BEGIN");
		await pool.query(
			"INSERT INTO renting (booking_id, cc_number, expiry_date) VALUES($1, $2, $3) RETURNING *",
			[books.booking_id, cc_number, expiry_date]
		);
		await pool.query(
			"INSERT INTO manages (booking_id, hotel_id, room_number, customer_sin, employee_sin) VALUES($1, $2, $3, $4, $5) RETURNING *",
			[
				books.booking_id,
				books.hotel_id,
				books.room_number,
				books.customer_sin,
				employee_sin,
			]
		);
		await pool.query("COMMIT");
	} catch (error) {
		await pool.query("ROLLBACK");
		console.log(error.message);
	}
});

// get booking with booking_id
app.get("/booking/:booking_id", async (req, res) => {
	try {
		const { booking_id } = req.params;
		const booking = await pool.query(
			"SELECT * FROM bookings WHERE booking_id = $1",
			[booking_id]
		);
		res.json(booking.rows[0]);
	} catch (error) {
		console.log(error.message);
	}
});

//update booking check-in and out dates
app.put("/booking/:booking_id", async (req, res) => {
	try {
		const { booking_id } = req.params;
		const { checkin_date, checkout_date } = req.body;

		await pool.query("BEGIN");

		await pool.query(
			"UPDATE booking SET checkin_date = $1 WHERE booking_id = $2",
			[checkin_date, booking_id]
		);
		await pool.query(
			"UPDATE booking SET checkout_date = $1 WHERE booking_id = $2",
			[checkout_date, booking_id]
		);

		await pool.query("COMMIT");
		res.json("booking's check-in and check-out dates are updated");
	} catch (error) {
		console.log(error.message);
		await pool.query("ROLLBACK");
	}
});

// async function for inserting new bookings
async function insertBooking(req, res) {
	try {
		const {
			checkin_date,
			checkout_date,
			hotel_id,
			room_number,
			customer_sin,
		} = req.body;

		const newBooking = await pool.query(
			"INSERT INTO booking (checkin_date, checkout_date) VALUES($1, $2) RETURNING *",
			[checkin_date, checkout_date]
		);
		const booking_id = newBooking.rows[0].booking_id;
		const newBooks = await pool.query(
			"INSERT INTO books (booking_id, hotel_id, room_number, customer_sin) VALUES($1, $2, $3, $4) RETURNING *",
			[booking_id, hotel_id, room_number, customer_sin]
		);
		res.json(newBooking.rows[0], newBooks.rows[0]);
		return newBooks.rows[0];
	} catch (error) {
		console.log(error.message);
	}
}

app.listen(5000, () => {
	console.log("server has started on port 5000");
});
