const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authController");

router.post("/register", register);

//FR8
const { db } = require("../firebase-service");
const admin = require("firebase-admin");
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/profile", authenticate, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.uid).get();
    const userData = userDoc.data();
    res.json({
      email_notifications_enabled: userData?.email_notifications_enabled ?? true
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load profile" });
  }
});

router.put("/notifications", authenticate, async (req, res) => {
  const { email_notifications_enabled } = req.body;

  try {
    await db.collection("users").doc(req.uid).update({
      email_notifications_enabled
    });
    res.status(200).json({ message: "Notification preference updated" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update preference" });
  }
});
//FR8

module.exports = router;
