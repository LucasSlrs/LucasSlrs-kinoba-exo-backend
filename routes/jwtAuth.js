const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

const salt = 10;

router.post("/signup", validInfo, async (req, res) => {
  try {
    const { phone_number, first_name, last_name, password } = req.body;
    const hashedPassword = await bcrypt.hashSync(password, salt);
    //check if user exist
    const user = await pool.query(
      "SELECT * FROM users WHERE phone_number = $1",
      [phone_number]
    );
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exist");
    }
    //if user is not created, create it
    const newUser = await pool.query(
      "INSERT INTO users (phone_number, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *",
      [phone_number, first_name, last_name, hashedPassword]
    );
    //generate jwt Token

    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", validInfo, async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    //check if user exist

    const user = await pool.query(
      "SELECT * FROM users WHERE phone_number = $1",
      [phone_number]
    );
    if (user.rows.length === 0) {
      return res.status(401).json("Phone number or password incorrect");
    }

    // check if incoming passwor is the same as db password

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Phone number or password incorrect");
    }
    // give the token
    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    await res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
