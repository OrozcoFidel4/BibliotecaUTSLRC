import express from 'express';
import cookieParser from 'cookie-parser';
import mysql from 'mysql2/promise';
//import bcrypt from 'bcrypt';
import cors from 'cors';
//import jwt from 'jsonwebtoken';

const app = express();


 const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'libros',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}); 


async function probarConexion() {
  try {
    const connection = await db.getConnection();
    console.log('Conexión a la base de datos establecida correctamente');
    connection.release();
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
  }
}
probarConexion();

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());


app.listen(4000, () => {
    console.log('Servidor corriendo en el puerto 4000');
});


//Api consulta de alumnos
app.get("/alumnos", async (req, res) => {
  const { nombre = "" } = req.query;
  try {
    const connection = await db.getConnection();
    const searchQuery = `%${nombre}%`;
    
    const [alumnos] = await connection.query(
      `SELECT * FROM alumnos WHERE CONCAT(NOMBRE, ' ', APELLIDO_MATERNO, ' ', APELLIDO_PATERNO) LIKE ?`,
      [searchQuery]
    );
    
    connection.release();
    res.json({ data: alumnos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar alumnos" });
  }
});


// API consulta de libros
app.get("/libros", async (req, res) => {
  const { limit = 20, offset = 0, search = "" } = req.query;

  try {
    const connection = await db.getConnection();

    const searchQuery = `%${search.trim()}%`;
    const parsedLimit = Math.max(1, parseInt(limit) || 20);
    const parsedOffset = Math.max(0, parseInt(offset) || 0);

    // Consulta principal directamente sobre libros_limpios
    const [libros] = await connection.query(
      `
      SELECT 
        id,
        ISBN,
        titulo,
        autor,
        editorial,
        edicion,
        año_edicion,
        numero_de_paginas,
        sinopsis,
        locacion,
        cantidad_total
      FROM libros_limpios
      WHERE titulo LIKE ? OR autor LIKE ?
      LIMIT ? OFFSET ?
      `,
      [searchQuery, searchQuery, parsedLimit, parsedOffset]
    );

    // Conteo total sin necesidad de subconsulta
    const [[{ total }]] = await connection.query(
      `
      SELECT COUNT(*) as total
      FROM libros_limpios
      WHERE titulo LIKE ? OR autor LIKE ?
      `,
      [searchQuery, searchQuery]
    );

    connection.release();

    res.json({ data: libros, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener libros" });
  }
});




// API Login Request
app.post('/api/login', (req,res)=> {
    console.log('BODY', req.body);
    const {email, password} = req.body;

 if (email === 'admin@gmail.com' && password === '123456') {
    console.log(email,password)
    res.cookie('token', 'valor-de-token', {
      httpOnly: true,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });
    return res.json({ message: 'Login exitoso' });
  }

  return res.status(401).json({ error: 'Credenciales incorrectas' });
});


// Ruta protegida
app.get('/api/usuario', (req, res) => {
  const { token } = req.cookies;
  if (token === 'valor-de-token') {
    return res.json({ email: 'admin@email.com' });
  }
  return res.status(401).json({ error: 'No autorizado' });
});

// Ruta limpia usuarios
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false // usa true si estás en HTTPS
  });
  return res.json({ message: 'Logout exitoso' });
});


//Api prestamo create
app.post('/prestamos', async (req, res) => {
  const { ISBN, fechaPrestamo, fechaDevolucion, nombreSolicitante } = req.body;

  try {
    // 1. Verificar que hay libros disponibles
    const [libro] = await db.query(
      'SELECT cantidad_total FROM libros_limpios WHERE ISBN = ?',
      [ISBN]
    );

    if (!libro || libro.cantidad_total_en_existencia < 1) {
      return res.status(400).json({ message: 'Libro no disponible' });
    }

    // 2. Insertar préstamo en tabla prestamos (ajusta a tu esquema)
    await db.query(
      'INSERT INTO prestamos (ISBN, fecha_prestamo, fecha_devolucion, nombre_solicitante) VALUES (?, ?, ?, ?)',
      [ISBN, fechaPrestamo, fechaDevolucion, nombreSolicitante]
    );

    // 3. Actualizar cantidad disponible (restar 1)
    await db.query(
      'UPDATE libros_limpios SET cantidad_total = cantidad_total - 1 WHERE ISBN = ?',
      [ISBN]
    );

    res.json({ message: 'Préstamo realizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


//Api consulta prestamos 
app.get('/prestamos/activos', async (req, res) => {
  try {
    const { search = "" } = req.query;
    const hoy = new Date().toLocaleDateString("en-CA");

    const searchQuery = `%${search.trim()}%`;

    const [prestamos] = await db.query(
      `SELECT p.*, l.titulo, l.autor 
       FROM prestamos p
       JOIN libros_limpios l ON p.ISBN = l.ISBN
       WHERE (l.titulo LIKE ? OR l.autor LIKE ? OR p.nombre_solicitante LIKE ?)`,
      [searchQuery, searchQuery, searchQuery, hoy]
    );

    res.json({ data: prestamos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener préstamos activos' });
  }
});


// API Libros devolucion 
app.put("/prestamos/devolver", async (req, res) => {
  const {
    ISBN,
    nombre_solicitante,
    fecha_prestamo,
    condiciones = {}
  } = req.body;

  const { roto = false, manchado = false, mojado = false, rayado=false, retraso=false } = condiciones;

  if (!ISBN || !nombre_solicitante || !fecha_prestamo) {
    return res.status(400).json({ message: "Faltan datos para identificar el préstamo" });
  }

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    const fecha_prestamo_sql = formatearFechaSQL(fecha_prestamo);
    if (!fecha_prestamo_sql) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ message: "Fecha de préstamo inválida" });
    }

    const fechaActual = new Date().toISOString().split("T")[0];

    // Insertar en historial con daños
    await connection.query(
      `INSERT INTO historial_prestamos (
         ISBN, nombre_solicitante, fecha_prestamo, fecha_devolucion,
         roto, manchado, mojado, rayado, retraso
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ISBN,
        nombre_solicitante,
        fecha_prestamo_sql,
        fechaActual,
        roto,
        manchado,
        mojado,
        rayado,
        retraso
      ]
    );

    // Eliminar préstamo activo
    await connection.query(
      `DELETE FROM prestamos
       WHERE ISBN = ? AND nombre_solicitante = ? AND DATE(fecha_prestamo) = ?`,
      [ISBN, nombre_solicitante, fecha_prestamo_sql]
    );

    // Actualizar stock
    await connection.query(
      `UPDATE libros_limpios
       SET cantidad_total = cantidad_total + 1
       WHERE ISBN = ?`,
      [ISBN]
    );

    await connection.commit();
    connection.release();

    res.json({ message: "Libro devuelto, daños registrados, stock actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al procesar la devolución" });
  }
});


// Función para convertir fecha ISO a YYYY-MM-DD
function formatearFechaSQL(fechaISO) {
  const fecha = new Date(fechaISO);
  if (isNaN(fecha)) return null;
  return fecha.toISOString().split("T")[0];
}



// API historial
app.get('/historial', async (req, res) => {
  const {
    limit = 10,
    offset = 0,
    search = '',
    isbn = '',
    fechaDesde = '',
    fechaHasta = '',
  } = req.query;

  try {
    const connection = await db.getConnection();

    const condiciones = [];
    const valores = [];

    if (search) {
      condiciones.push(`nombre_solicitante LIKE ?`);
      valores.push(`%${search}%`);
    }
    if (isbn) {
      condiciones.push(`ISBN LIKE ?`);
      valores.push(`%${isbn}%`);
    }
    if (fechaDesde) {
      condiciones.push(`fecha_prestamo >= ?`);
      valores.push(fechaDesde);
    }
    if (fechaHasta) {
      condiciones.push(`fecha_prestamo <= ?`);
      valores.push(fechaHasta);
    }

    const whereClause = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

    const [historial] = await connection.query(
      `SELECT * FROM historial_prestamos ${whereClause} ORDER BY fecha_prestamo DESC LIMIT ? OFFSET ?`,
      [...valores, parseInt(limit), parseInt(offset)]
    );

    const [[{ total }]] = await connection.query(
      `SELECT COUNT(*) AS total FROM historial_prestamos ${whereClause}`,
      valores
    );

    connection.release();

    res.json({ data: historial, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener historial' });
  }
});


// API historial estadisticas
app.get("/estadisticas/mas-prestados-por-mes", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(h.fecha_prestamo, '%Y-%m') AS mes,
        h.ISBN,
        COALESCE(l.titulo, 'Título no disponible') AS titulo,
        COUNT(*) AS cantidad_prestamos
      FROM historial_prestamos h
      LEFT JOIN libros_limpios l 
        ON REPLACE(REPLACE(h.ISBN, '-', ''), ' ', '') = REPLACE(REPLACE(l.ISBN, '-', ''), ' ', '')
      GROUP BY mes, h.ISBN, titulo
      ORDER BY mes DESC, cantidad_prestamos DESC
    `);

    res.json({ data: rows });
  } catch (error) {
    console.error("Error en estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
});


