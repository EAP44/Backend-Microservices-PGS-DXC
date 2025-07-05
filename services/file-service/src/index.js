const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const fileRoutes = require('./routes/file.routes');
const app = express();

app.use(express.json());
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI);


app.use('/api/files', fileRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`File Service running on port 3020`));
