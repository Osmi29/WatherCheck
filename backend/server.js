const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
mongoose.connect('mongodb+srv://WaterCheck:Al23311523@cluster0.is03z.mongodb.net/WaterCheckDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar con MongoDB:', err));



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
}); 

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());


   
const usuarioSchema = new mongoose.Schema({
  Nombre: String,
  Correo: String,
  Contraseña: String,
  Imagen: String, 
  Fecha_registro: { type: Date, default: Date.now }

  
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
// ESTO ES PARA OBTENER LOS DATOS DE LOS SENSORES//////////////////////////////////////////////


const sensorSchema = new mongoose.Schema({
  ph: Number,
  conductividad: Number,
  temperatura: Number,  // Corregido con minúscula para coherencia
  fecha: { type: Date, default: Date.now }
});

const Sensor = mongoose.model('Sensor', sensorSchema);


app.post('/api/registrar', upload.single('imagen'), async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

 
  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  let imagen = '';
  if (req.file) {
    imagen = req.file.path; 
  }

  try {
    const nuevoUsuario = new Usuario({
      Nombre: nombre,
      Correo: correo,
      Contraseña: contrasena,
      Imagen: imagen
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ message: 'Error al registrar usuario', error: err });
  }
});

// Ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
  const { Correo, Contraseña } = req.body;

  if (!Correo || !Contraseña) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const usuario = await Usuario.findOne({ Correo });

    if (!usuario || usuario.Contraseña !== Contraseña) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Devolver usuario completo en la respuesta
    res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', usuario });
  } catch (err) {
    console.error('Error en el inicio de sesión:', err);
    res.status(500).json({ message: 'Error en el servidor', error: err });
  }
});
// Ruta para recibir datos del Arduino////////////////////////////////////////////
app.post('/api/datos', async (req, res) => {
  try {
    const { ph, conductividad, Temperatura} = req.body;

    // Validar que los valores existen
    if (ph === undefined || conductividad === undefined) {
      return res.status(400).json({ message: 'Faltan datos del sensor' });
    }

    // Guardar en la base de datos
    const nuevoDato = new Sensor({ ph, conductividad, Temperatura });
    await nuevoDato.save();

    res.status(201).json({ message: '✅ Datos guardados correctamente', data: nuevoDato });
  } catch (error) {
    console.error('❌ Error al guardar datos del sensor:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});
//Para hacer publicos los archivos de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor backend corriendo en http://localhost:3000');
});

// Ruta para iniciar sesión
 
  