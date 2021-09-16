const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");

const salt = 10;

router.post("/signup", async (req, res) => {
  try {
    const { phone_number, first_name, last_name, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await pool.query(
      "INSERT INTO users (phone_number, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *",
      [phone_number, first_name, last_name, hashedPassword]
    );
    res.json(newUser.rows[0]);
    req.flash("success_msg", "You are now registered. Please log in");
    res.redirect("/login");
  } catch (err) {
    console.error(err.message);
  }
});
// router.get("/isLoggedIn", async (req, res) => {
//   if
// })
module.exports = router;
