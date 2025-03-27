const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://WaterCheck:<12345678>@cluster0.is03z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('🔥 Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar:', err));

// Esquemas corregidos para coincidir con la base de datos
const UsuarioSchema = new mongoose.Schema({
  Nombre: String,
  Correo: String,
  Contraseña: String,
  Foto: String,
  Fecha_registro: Date
});

const ContenedorSchema = new mongoose.Schema({
  ID: Number,
  Estado: Number
}, { collection: 'nivel_cont' }); // Especificar nombre de colección

// Modelos
const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Contenedor = mongoose.model('Contenedor', ContenedorSchema);
const CalidadAgua = mongoose.model('CalidadAgua', new mongoose.Schema({ calidad: Number }));

// Endpoints
app.get('/api/usuario', async (req, res) => {
  const { correo } = req.query;

  if (!correo) {
    return res.status(400).json({ error: '❌ Falta el correo del usuario' });
  }

  try {
    const usuario = await Usuario.findOne({ Correo: correo });

    if (!usuario) {
      return res.status(404).json({ error: '❌ Usuario no encontrado' });
    }

    res.json({
      Nombre: usuario.Nombre,
      Foto: usuario.Foto
    });
  } catch (err) {
    res.status(500).json({ error: '❌ Error al obtener usuario' });
  }
});

app.get('/api/contenedor', async (req, res) => {
  try {
    const contenedor = await Contenedor.findOne({ ID: 1 });
    
    if (!contenedor) {
      return res.status(404).json({ error: '❌ No se encontró el contenedor' });
    }

    res.json({ estado: contenedor.Estado });
  } catch (err) {
    res.status(500).json({ error: '❌ Error al obtener estado del contenedor' });
  }
});

app.post('/api/vaciar', async (req, res) => {
  try {
    await Contenedor.updateOne({ ID: 1 }, { Estado: 0 });
    res.json({ mensaje: 'Contenedor vaciado' });
  } catch (err) {
    console.error('Error al vaciar el contenedor:', err);
    res.status(500).json({ error: '❌ Error al vaciar' });
  }
});

// Resto de endpoints igual...

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});