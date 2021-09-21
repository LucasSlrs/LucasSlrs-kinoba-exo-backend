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

//routes//
let authRouter = require("./routes/jwtAuth");
app.use("/user/auth", authRouter);

let dashboardRouter = require("./routes/dashboard");
app.use("/user/dashboard", dashboardRouter);

let messagesRouter = require("./routes/messages");
app.use("/user/message", messagesRouter);

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
