require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/file.routes');
const app = express();
app.listen(3000);
