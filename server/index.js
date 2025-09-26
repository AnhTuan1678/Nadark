const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const ENV = process.env.NODE_ENV || 'development';

app.get('/', (req, res) => {
  res.send(`Hello from ${ENV} environment!`);
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/ in ${ENV} mode`);
});