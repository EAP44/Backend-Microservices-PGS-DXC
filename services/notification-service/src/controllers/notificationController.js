const webpush = require("web-push");
const Token = require("../models/Token");

webpush.setVapidDetails(
  "mailto:test@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

exports.subscribe = async (req, res) => {
  try {
    const existing = await Token.findOne({ userId: req.userId });
    if (existing) await Token.deleteOne({ _id: existing._id });

    await Token.create({ userId: req.userId, subscription: req.body });
    res.status(201).json({ message: "Subscribed" });
  } catch (err) {
    res.status(500).json({ message: "Subscription failed", error: err.message });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const { toUserId, message } = req.body;
    const tokenDoc = await Token.findOne({ userId: toUserId });
    if (!tokenDoc) return res.status(404).json({ message: "User not subscribed" });

    await webpush.sendNotification(
      tokenDoc.subscription,
      JSON.stringify({ title: "Notification", message })
    );

    res.json({ message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ message: "Sending notification failed", error: err.message });
  }
};