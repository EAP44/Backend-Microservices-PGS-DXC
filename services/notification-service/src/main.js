const express = require('express');
const http = require('http');
require("dotenv").config();
const notificationRoutes = require('./routes/notificationRoutes');
const { consumeNotifications } = require('./services/RabbitMQ-config');
const { sendNotificationEmail } = require('./services/mailer-config');
const { initSocket, sendSocketNotification } = require('./services/socketService');
const connectDB = require('./database/mongodb');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

app.use(express.json());
app.use('/api', notificationRoutes);

(async () => {
  try {
    await connectDB();
    initSocket(server);

    await consumeNotifications(async (notification) => {
      sendSocketNotification(notification);
      await sendNotificationEmail(notification);
    });

    server.listen(PORT, () => {
      console.log(`Notification Service running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Échec du démarrage du serveur:", error);
    process.exit(1);
  }
})();
