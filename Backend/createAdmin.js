// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const Admin = require('./models/Admin');

const MONGO_URI = 'mongodb+srv://ealvarez:STalvarez015@cluster0.fmvu6nq.mongodb.net/qrcomedor?retryWrites=true&w=majority&appName=Cluster0'; // reemplazalo por el real

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const preguntar = (texto, ocultar = false) => {
  return new Promise((resolve) => {
    if (ocultar) {
      process.stdout.write(texto);
      process.stdin.setRawMode(true);
      let input = '';
      process.stdin.on('data', (char) => {
        char = char.toString();
        if (char === '\n' || char === '\r' || char === '\u0004') {
          process.stdin.setRawMode(false);
          process.stdout.write('\n');
          process.stdin.removeAllListeners('data');
          resolve(input);
        } else if (char === '\u0003') {
          process.exit();
        } else {
          input += char;
          process.stdout.write('*');
        }
      });
    } else {
      rl.question(texto, (respuesta) => resolve(respuesta));
    }
  });
};

const crearAdmin = async () => {
  try {
    const username = await preguntar('Nombre de usuario: ');
    const password = await preguntar('Contraseña: ', true);

    await mongoose.connect(MONGO_URI);
    console.log('\nConectado a MongoDB');

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoAdmin = new Admin({
      username,
      password: hashedPassword
    });

    await nuevoAdmin.save();
    console.log(' Administrador creado exitosamente.');
  } catch (error) {
    console.error('Error al crear el administrador:', error.message);
  } finally {
    mongoose.connection.close();
    rl.close();
  }
};

crearAdmin();
