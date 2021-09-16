const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

const initializePassport = require("./passportConfig");

initializePassport(passport);

//Middleware//
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //Allow client to send cookies.
  })
);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(express.json());

//Midldeware that handles a ressource that wasn't found

//routes//
let authRouter = require("./routes/auth");
const initialize = require("./passportConfig");
app.use("/user/auth", authRouter);

// let usersRouter = require("./routes/users");
// app.use("/users", usersRouter);

// login

app.post(
  "user/auth/login",
  passport.authenticate("local", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/user/auth/login",
    failureFlash: true,
  })
);

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
