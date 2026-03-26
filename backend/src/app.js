const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes');
const { CLIENT_URL } = require('./config/env');
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(generalLimiter);
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, data: null, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
