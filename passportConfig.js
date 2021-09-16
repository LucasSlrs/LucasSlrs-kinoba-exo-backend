const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./db");
const bcrypt = require("bcrypt");

const initialize = (passport) => {
  const authenticateUser = (phone_number, password, done) => {
    pool.query(
      "SELECT * FROM users WHERE phone_number = $1",
      [phone_number],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message:
                  "An error occured. Phone number or password is incorect",
              });
            }
          });
        } else {
          return done(null, false, {
            message: "An error occured. Phone number or password is incorect",
          });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: "phone_number",
        passwordField: "password",
      },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user_id));

  passport.deserializeUser((user_id, done) => {
    pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id],
      (err, results) => {
        if (err) {
          throw err;
        }
        return done(null, results.rows[0]);
      }
    );
  });
};
module.exports = initialize;
