const express = require('express');
const port = 8080;
const app = express();

const apiRoutes = require('./routes/api-routes');

app.use(express.json());

app.use('/api', apiRoutes);
app.get('/', (req, res) => {
  res.status(200);
});

app.listen(port, () => {
  console.log('running employee app ', port);
});
