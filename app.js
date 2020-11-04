const express = require('express');
const app = express();

const apiRoutes = require('./routes/api-routes');

app.use(express.json());

app.use('/api', apiRoutes);
app.get('/', (req, res) => {
  res.status(200).json('hello from employee app');
});

module.exports = app;
