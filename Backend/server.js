require('dotenv').config();

const mongoose = require('mongoose');


const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

const cors = require('cors');
const allowedOrigins = [
  'http://localhost:5173',
  'https://backend-emmanuels-projects-d9e6d035.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
app.use('/api/turnos', turnoRoutes);


// Solo un app.listen
app.listen(port, () => {
  console.log(`?? Servidor escuchando en http://localhost:${port}`);
});

app.post('/api/test', (req, res) => {
  console.log('Body recibido:', req.body);
  res.json({ recibido: req.body });
});