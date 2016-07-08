const express = require('express');
const app = express();
const join = require('path').join;

app.use(express.static('src'));
app.use(express.static('bower_components'));
app.use(express.static('bower_components/three.js/examples/js'));

app.use((req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(3000, () => console.log('Server listening on http://localhost:3000'));
