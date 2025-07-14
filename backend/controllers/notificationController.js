//FR8 Notifications
const { firestore } = require('../firebase-service');
  exports.updateNotificationPreference = async (req, res) => {
  const uid = req.user.uid;
  const { email_notifications_enabled } = req.body;

  try {
    await firestore.collection('users').doc(uid).update({ email_notifications_enabled });
    res.status(200).json({ message: "Preference updated." });
  } catch (err) {
    res.status(500).json({ error: "Update failed." });
  }
};


