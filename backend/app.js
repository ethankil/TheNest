const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

module.exports = app;

//FR8

const sendEmail = require("./utils/sendEmail");

app.get("/test-email", async (req, res) => {
  try {
    await sendEmail("your_personal_email@gmail.com", "Test Email", "This is a test from The Nest.");
    res.send("✅ Test email sent");
  } catch (err) {
    console.error("❌ Email error:", err);
    res.status(500).send("❌ Failed to send test email");
  }
});

