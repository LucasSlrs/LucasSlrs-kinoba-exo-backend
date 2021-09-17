module.exports = function (req, res, next) {
  const { phone_number, first_name, last_name, password } = req.body;

  function validPhoneNumber(phone_number) {
    return /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/.test(
      phone_number
    );
  }

  if (req.path === "/signup") {
    if (![phone_number, first_name, last_name, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validPhoneNumber(phone_number)) {
      return res.status(401).json("Invalid phone number");
    }
  } else if (req.path === "/login") {
    if (![phone_number, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validPhoneNumber(phone_number)) {
      return res.status(401).json("Invalid phone number");
    }
  }

  next();
};
