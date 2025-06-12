const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

const PORT = 9000;

const comparisons = {}
const listaClicks = []

app.post('/comparison', (req, res) => {
  const { izquierda, derecha } = req.body;

  const ip = req.socket.remoteAddress;
  const date = new Date();

  comparisons[ip] = { izquierda, derecha, date };
  res.status(201).json({ message: 'OK' });
});

app.post('/position', (req, res) => {
  const { x, y } = req.body;

  const ip = req.socket.remoteAddress

  if (!listaClicks[ip]) {
    listaClicks[ip] = [];
  }

  listaClicks[ip].push({x, y, date: new Date()})
  res.status(201).json({ message: 'OK' })
})

app.get('/position', (req, res) => {
  const ip = req.socket.remoteAddress;
  const clicks = listaClicks[ip] || [];
  
  res.status(200).json(clicks);
})

app.get('/comparison', (req, res) => {
  res.status(200).json(comparisons[req.socket.remoteAddress] || {
    izquierda: 0, derecha: 0
  });
});

app.get('/stats', (req, res) => {
  const listaGanadores = Object.entries(comparisons).map(([ip, datos]) => {
    const { izquierda, derecha } = datos;
    let resultado = 'empate';
    if (izquierda > derecha) resultado = 'izquierda';
    else if (derecha > izquierda) resultado = 'derecha';
    return { ip, ganador: resultado };
  });

  res.status(200).json(listaGanadores);
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
