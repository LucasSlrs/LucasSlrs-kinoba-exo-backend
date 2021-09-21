const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const session = require("express-session");

//Middleware//
app.use(express.json()); //req.body

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

//Midldeware that handles a ressource that wasn't found

//routes//
let authRouter = require("./routes/jwtAuth");
app.use("/user/auth", authRouter);

let dashboardRouter = require("./routes/dashboard");
app.use("/user/dashboard", dashboardRouter);

let messagesRouter = require("./routes/messages");
app.use("/user/message", messagesRouter);

//update a user
// app.put("/user/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { phone_number } = req.body;
//     const updatePhoneNumer = await pool.query(
//       "UPDATE users SET phone_number = $1 WHERE user_id = $2",
//       [phone_number, id]
//     );
//     res.json("Updated");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //delete a user
// app.delete("/user/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleteUser = await pool.query(
//       "DELETE FROM users WHERE user_id = $1",
//       [id]
//     );
//     res.json("User has been deleted");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
