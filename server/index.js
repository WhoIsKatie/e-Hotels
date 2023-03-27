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
        const { name, street_num, street_name, unit_num, city, country, postal_code } = req.body;
        const newChain = await pool.query(
            "INSERT INTO hotel_chain (name, street_num, street_name, unit_num, city, country, postal_code) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [name, street_num, street_name, unit_num, city, country, postal_code]
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


app.listen(5000, () => {
    console.log("server has started on port 5000")
});