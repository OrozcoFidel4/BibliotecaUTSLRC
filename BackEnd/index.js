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
      `SELECT * FROM alumnos WHERE CONCAT(NOMBRE, ' ', APELLIDO_PATERNO, ' ', APELLIDO_MATERNO) LIKE ?`,
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

    // Consulta principal agrupando por libro
    const [libros] = await connection.query(
      `
      SELECT 
        ISBN, 
        titulo, 
        autor, 
        edicion,
        COUNT(*) as cantidad_total_en_existencia
      FROM libros
      WHERE titulo LIKE ? OR autor LIKE ?
      GROUP BY ISBN, titulo, autor, edicion
      LIMIT ? OFFSET ?
      `,
      [searchQuery, searchQuery, parsedLimit, parsedOffset]
    );

    // Conteo total de grupos únicos
    const [[{ total }]] = await connection.query(
      `
      SELECT COUNT(*) as total
      FROM (
        SELECT 1
        FROM libros
        WHERE titulo LIKE ? OR autor LIKE ?
        GROUP BY ISBN, titulo, autor, edicion
      ) as subconsulta
      `,
      [searchQuery, searchQuery]
    );

    connection.release();

    res.json({ data: libros, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener libros agrupados" });
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
      'SELECT cantidad_total_en_existencia FROM libros WHERE ISBN = ?',
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
      'UPDATE libros SET cantidad_total_en_existencia = cantidad_total_en_existencia - 1 WHERE ISBN = ?',
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
    // Obtener fecha actual en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split('T')[0];

const [prestamos] = await db.query(
  `SELECT p.*, l.titulo, l.autor 
   FROM prestamos p
   JOIN libros l ON CONVERT(p.ISBN USING utf8mb4) COLLATE utf8mb4_unicode_ci = l.ISBN
   WHERE p.fecha_devolucion >= ?`,
  [hoy]
);

    res.json({ data: prestamos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener préstamos activos' });
  }
});

