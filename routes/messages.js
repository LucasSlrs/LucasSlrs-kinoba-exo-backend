const router = require("express").Router();
const pool = require("../db");

router.post("/send", async (req, res) => {
  try {
    const { message, message_from, message_to, message_date } = req.body;
    const msg = await pool.query(
      "INSERT INTO messages (message, message_from, message_to, message_date) VALUES($1, $2, $3, $4) RETURNING *",
      [message, message_from, message_to, message_date]
    );
    res.json(msg.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
router.get("/conversation", async (req, res) => {
  try {
    const allMessages = await pool.query("SELECT * FROM messages");
    res.json(allMessages.rows);
  } catch (err) {
    console.error(err.message);
  }
});
router.get("/messagesTo/:message_from/:message_to", async (req, res) => {
  try {
    const { message_from, message_to } = req.params;
    const allMessagesFromTO = await pool.query(
      "SELECT * FROM messages WHERE message_from = $1 AND message_to = $2",
      [message_from, message_to]
    );
    res.json(allMessagesFromTO.rows);
  } catch (err) {
    console.error(err.message);
  }
});
module.exports = router;
