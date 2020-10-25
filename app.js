const express = require('express');
const port = 8080;
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200);
});

app.listen(port, () => {
  console.log('running employee app ', port);
});
