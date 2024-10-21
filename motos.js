const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000; // Cambia este valor a un puerto que no esté en uso

// Permitir acceso desde el frontend Angular
app.use(cors());
app.use(express.json());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',   // Cambia por tu usuario de MySQL
  password: '',   // Cambia por tu contraseña de MySQL
  database: 'motosvelazquez',
  port: 3306
});

// Verificar conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

// Endpoint para obtener todas las motos
app.get('/api/motos', (req, res) => {
  const sql = 'SELECT id, nombre, marca, precio, imagen, cv, cc FROM motos';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al obtener las motos');
    } else {
      // Convertir cada imagen binaria a Base64 antes de enviar la respuesta
      const motos = results.map(moto => ({
        ...moto,
        imagen: moto.imagen ? Buffer.from(moto.imagen).toString('base64') : null
      }));
      res.json(motos);
    }
  });
});

// Endpoint para obtener una moto específica por ID
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
      res.status(500).send('Error al obtener los accesorios');
    } else {
      // Convertir cada imagen binaria a Base64 antes de enviar la respuesta
      const accesorios = results.map(accesorio => ({
        ...accesorio,
        imagen: accesorio.imagen ? Buffer.from(accesorio.imagen).toString('base64') : null
      }));
      res.json(accesorios);
    }
  });
});

// Nuevo endpoint para obtener todas las prendas de ropa
app.get('/api/ropa', (req, res) => {
  const sql = 'SELECT id_ropa, nombre, precio, imagen, categoria, descripcion FROM ropa';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al obtener la ropa');
    } else {
      // Convertir cada imagen binaria a Base64 antes de enviar la respuesta
      const ropa = results.map(item => ({
        ...item,
        imagen: item.imagen ? Buffer.from(item.imagen).toString('base64') : null
      }));
      res.json(ropa);
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
