const express = require('express');
const app = express();
const join = require('path').join;
const port = process.env.PORT || 8000;

app.use(express.static('dist'));
app.use(express.static('src'));

app.use((req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)); // eslint-disable-line
