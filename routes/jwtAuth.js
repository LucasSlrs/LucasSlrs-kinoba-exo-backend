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
//-----------------------------------------------------------
//Not to use now but to delete useless users
router.delete("/user/:id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const deleteUser = await pool.query(
      "DELETE FROM users WHERE user_id = $1",
      [user_id]
    );
    res.json("User has been deleted");
  } catch (err) {
    console.error(err.message);
  }
});
//-----------------------------------------------------------
router.get("/listusers", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});
router.get("/getuser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userById = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [id]
    );
    res.json(userById.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
module.exports = router;
