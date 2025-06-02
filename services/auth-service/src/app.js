const express = require('express');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/auth', authRoutes);

app.all('*', (req, res) => {
  res.status(404).json({ message: `Cannot find ${req.originalUrl} on this server.` });
});

module.exports = app;
