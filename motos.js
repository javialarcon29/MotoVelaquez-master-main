const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();  // Para usar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;  // Puerto configurable con variable de entorno

// Permitir acceso desde el frontend Angular (configurando CORS)
const corsOptions = {
  origin: 'http://localhost:4200', // Cambia este valor por la URL de tu frontend
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',   // Usuario de MySQL desde variable de entorno
  password: process.env.DB_PASS || '',   // Contraseña de MySQL desde variable de entorno
  database: process.env.DB_NAME || 'motosvelazquez',
  port: process.env.DB_PORT || 3306
});

// Manejo de reconexión automática en caso de error
function handleDisconnect() {
  db.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      setTimeout(handleDisconnect, 2000); // Intentar reconectar en 2 segundos
    } else {
      console.log('Conectado a la base de datos MySQL');
    }
  });

  db.on('error', (err) => {
    console.error('Error en la base de datos:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconectar si se pierde la conexión
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// Endpoint para obtener todas las motos (con paginación)
app.get('/api/motos', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = 'SELECT id, nombre, marca, precio, imagen, cv, cc FROM motos LIMIT ? OFFSET ?';
  db.query(sql, [limit, offset], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).send('Error al obtener las motos');
    }
    
    // Convertir cada imagen binaria a Base64
    const motos = results.map(moto => ({
      ...moto,
      imagen: moto.imagen ? Buffer.from(moto.imagen).toString('base64') : null
    }));
    res.json(motos);
  });
});

// Endpoint para obtener una moto específica por ID (con validación)
app.get('/api/motos/:id', (req, res) => {
  const motoId = req.params.id;

  // Verificar si se proporciona un ID válido
  if (!motoId) {
    return res.status(400).send('ID de la moto no proporcionado');
  }

  const sql = 'SELECT id, nombre, marca, precio, descripcion, imagen, cv, cc FROM motos WHERE id = ?';
  db.query(sql, [motoId], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).send(`Error al obtener la moto: ${err.message}`);
    }

    if (results.length === 0) {
      return res.status(404).send('Moto no encontrada');
    }

    const moto = results[0];

    // Convertir imagen a base64 (si hay) o dejarla como null
    moto.imagen = moto.imagen ? Buffer.from(moto.imagen).toString('base64') : null;

    res.json(moto);
  });
});

// Endpoint para obtener todos los accesorios
app.get('/api/accesorios', (req, res) => {
  const sql = 'SELECT id, nombre, precio, imagen, categoria FROM accesorios';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).send('Error al obtener los accesorios');
    }

    // Convertir cada imagen binaria a Base64
    const accesorios = results.map(accesorio => ({
      ...accesorio,
      imagen: accesorio.imagen ? Buffer.from(accesorio.imagen).toString('base64') : null
    }));
    res.json(accesorios);
  });
});

// Endpoint para obtener todas las prendas de ropa (con paginación)
app.get('/api/ropa', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = 'SELECT id_ropa, nombre, precio, imagen, categoria, descripcion FROM ropa LIMIT ? OFFSET ?';
  db.query(sql, [limit, offset], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).send('Error al obtener la ropa');
    }

    // Convertir cada imagen binaria a Base64
    const ropa = results.map(item => ({
      ...item,
      imagen: item.imagen ? Buffer.from(item.imagen).toString('base64') : null
    }));
    res.json(ropa);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
