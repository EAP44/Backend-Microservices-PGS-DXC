const Notification = require("../database/models/notification");
const amqp = require("amqplib");
require("dotenv").config();
const AMQP_URL = process.env.AMQP_URL;

async function publishNotification(req, res) {
  const allowedFields = (({
    encadrantId,
    encadrantEmail,
    stagiaireName,
    stagiaireEmail,
  }) => ({
    encadrantId,
    encadrantEmail,
    stagiaireName,
    stagiaireEmail,
  }))(req.body);

const notification = new Notification(allowedFields);

  await notification.save();
  const connection = await amqp.connect(AMQP_URL);
  const channel = await connection.createChannel();
  const queue = "notification_queue";

  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(notification)));

  res.status(200).json({ message: "Notification publiée avec succès" });
}

const encadrantNotification = async (req, res) => {
  try {
    const encadrantId = req.user.id;
    const notifications = await Notification.find({ encadrantId }).sort({
      createdAt: -1,
    });
    res.status(201).json({ data: notifications ,id: encadrantId });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { publishNotification, encadrantNotification };
