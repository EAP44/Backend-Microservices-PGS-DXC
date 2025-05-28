const amqp = require("amqplib");
require("dotenv").config();
const Notification = require("../database/models/notification");

const AMQP_URL = process.env.AMQP_URL;

async function consumeNotifications(onMessage) {
  try {
    const connection = await amqp.connect(AMQP_URL);
    const channel = await connection.createChannel();
    const queue = "notification_queue";

    await channel.assertQueue(queue, { durable: false });
    console.log("Connexion à RabbitMQ établie, file déclarée :", queue); // debug to remove

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log("Notification reçue:", data);

          const saved = await Notification.create(data);
          console.log("Notification enregistrée en DB avec ID :", saved._id); // debug to remove

          await onMessage(data);

          channel.ack(msg);
        } catch (error) {
          console.error("Erreur pendant le traitement du message :", error.message); // debug to remove
        }
      }
    });
  } catch (err) {
    console.error("Impossible de se connecter à RabbitMQ :", err.message); // debug to remove
    process.exit(1);
  }
}

module.exports = { consumeNotifications };

