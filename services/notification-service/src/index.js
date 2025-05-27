const express = require("express");
const connectDB = require("./config/db");
const notificationRoutes = require("./routes/notification");
const PORT = process.env.PORT;
require("dotenv").config();

const app = express();
app.use(express.json());

connectDB();

app.use("/api/notification", notificationRoutes);

app.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));