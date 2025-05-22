const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./database/Mongoose');
const stagiaireRoutes = require('./routes/stagiaireRoutes');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/stagiaires', stagiaireRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
