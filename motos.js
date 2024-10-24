const express = require('express');
const mysql = require('mysql2/promise'); // Usamos promise para manejar asincronía
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Puerto dinámico para producción (como Vercel)

// Middleware para permitir acceso desde el frontend y manejar JSON
app.use(cors());
app.use(express.json());

// Conexión a la base de datos usando variables de entorno
async function getDBConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',  // IP del servidor de BD
    user: process.env.DB_USER || 'root',        // Usuario de la BD
    password: process.env.DB_PASSWORD || '',    // Contraseña de la BD
    database: process.env.DB_NAME || 'motosvelazquez', // Nombre de la base de datos
    port: process.env.DB_PORT || 3306,          // Puerto (default 3306 para MySQL/MariaDB)
    ssl: process.env.DB_SSL || false            // Desactiva SSL si no es necesario
  });
}

// Endpoint para obtener todas las motos
app.get('/api/motos', async (req, res) => {
  try {
    const db = await getDBConnection();
    const [results] = await db.query('SELECT id, nombre, marca, precio, imagen, cv, cc FROM motos');
    
    const motos = results.map(moto => ({
      ...moto,
      imagen: moto.imagen ? Buffer.from(moto.imagen).toString('base64') : null,
    }));

    await db.end(); // Cerramos la conexión
    res.json(motos);
  } catch (err) {
    console.error('Error al obtener las motos:', err);
    res.status(500).json({ error: 'Error al obtener las motos' });
  }
});

// Endpoint para obtener una moto específica por ID
app.get('/api/motos/:id', async (req, res) => {
  const motoId = req.params.id;

  if (!motoId) {
    return res.status(400).json({ error: 'ID de la moto no proporcionado' });
  }

  try {
    const db = await getDBConnection();
    const [results] = await db.query('SELECT id, nombre, marca, precio, descripcion, imagen, cv, cc FROM motos WHERE id = ?', [motoId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Moto no encontrada' });
    }

    const moto = results[0];
    moto.imagen = moto.imagen ? Buffer.from(moto.imagen).toString('base64') : null;

    await db.end();
    res.json(moto);
  } catch (err) {
    console.error('Error al obtener la moto:', err);
    res.status(500).json({ error: 'Error al obtener la moto' });
  }
});

// Endpoint para obtener todos los accesorios
app.get('/api/accesorios', async (req, res) => {
  try {
    const db = await getDBConnection();
    const [results] = await db.query('SELECT id, nombre, precio, imagen, categoria FROM accesorios');
    
    const accesorios = results.map(accesorio => ({
      ...accesorio,
      imagen: accesorio.imagen ? Buffer.from(accesorio.imagen).toString('base64') : null,
    }));

    await db.end();
    res.json(accesorios);
  } catch (err) {
    console.error('Error al obtener los accesorios:', err);
    res.status(500).json({ error: 'Error al obtener los accesorios' });
  }
});

// Endpoint para obtener todas las prendas de ropa
app.get('/api/ropa', async (req, res) => {
  try {
    const db = await getDBConnection();
    const [results] = await db.query('SELECT id_ropa, nombre, precio, imagen, categoria, descripcion FROM ropa');
    
    const ropa = results.map(item => ({
      ...item,
      imagen: item.imagen ? Buffer.from(item.imagen).toString('base64') : null,
    }));

    await db.end();
    res.json(ropa);
  } catch (err) {
    console.error('Error al obtener la ropa:', err);
    res.status(500).json({ error: 'Error al obtener la ropa' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

