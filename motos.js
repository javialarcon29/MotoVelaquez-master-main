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
  password: '', // Cambia por tu contraseña de MySQL
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
  const sql = 'SELECT id, nombre, marca, precio, imagen FROM motos';
  db.query(sql, (err, results) => {
    if (err) {
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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
