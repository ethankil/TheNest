// FR8 Notifications
const { firestore } = require('../firebase-service');
const sendEmail = require('../utils/sendEmail');
console.log("Post ID:", postId);
console.log("Post Owner ID:", postOwnerId);
console.log("Post Owner Email:", postOwner.data().email);
console.log("Sending to:", postOwner.data().email);


exports.addComment = async (req, res) => {
  const { postId } = req.body;
  const postRef = await firestore.collection('posts').doc(postId).get();
  const postOwnerId = postRef.data().userId;

  const postOwner = await firestore.collection('users').doc(postOwnerId).get();

  if (postOwner.exists && postOwner.data().email_notifications_enabled) {
    await sendEmail(postOwner.data().email, "New comment!", "Your post received a new comment.");
  }

  res.status(201).json({ message: "Comment added." });
};
