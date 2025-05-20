require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log(' Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
const usuarioRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuarioRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/authRoutes', authRoutes);

const turnoRoutes = require('./routes/turnos');
app.use('/api/turno', turnoRoutes);


// Solo un app.listen
app.listen(port, () => {
  console.log(`?? Servidor escuchando en http://localhost:${port}`);
});

app.post('/api/test', (req, res) => {
  console.log('Body recibido:', req.body);
  res.json({ recibido: req.body });
});