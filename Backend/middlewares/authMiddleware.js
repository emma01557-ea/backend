const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, autorización denegada' });
  }

  const token = authHeader.split(' ')[1]; // Extraer solo el token

  if (!token) {
    return res.status(401).json({ msg: 'Token mal formado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Info útil para rutas protegidas (por ejemplo: req.user.role)
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};
