const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");

const salt = 10;

//Middleware//
app.use(cors());
app.use(express.json());

//Midldeware that handles a ressource that wasn't found

//routes//
let authRouter = require("./routes/auth");
app.use("/user/auth", authRouter);

// let usersRouter = require("./routes/users");
// app.use("/users", usersRouter);

//get all users

app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get a user

app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a user
app.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { phone_number } = req.body;
    const updatePhoneNumer = await pool.query(
      "UPDATE users SET phone_number = $1 WHERE user_id = $2",
      [phone_number, id]
    );
    res.json("Updated");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a user
app.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query(
      "DELETE FROM users WHERE user_id = $1",
      [id]
    );
    res.json("User has been deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
