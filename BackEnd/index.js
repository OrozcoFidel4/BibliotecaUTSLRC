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


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));

app.listen(4000, () => {
    console.log('Servidor corriendo en el puerto 4000');
});


app.get("/libros", async (req, res) => {
  const { limit = 20, offset = 0, search = "" } = req.query;

  try {
    const connection = await db.getConnection();

    const searchQuery = `%${search}%`;

    const [libros] = await connection.query(
      `SELECT * FROM libros 
       WHERE titulo LIKE ? OR autor LIKE ? OR ISBN LIKE ? LIMIT ? OFFSET ?`,
      [searchQuery, searchQuery, searchQuery, parseInt(limit), parseInt(offset)]  
    );

    const [[{ total }]] = await connection.query(
      `SELECT COUNT(*) as total FROM libros 
       WHERE titulo LIKE ? OR autor LIKE ? OR ISBN LIKE ?`,  
      [searchQuery, searchQuery, searchQuery]
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


app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false // usa true si estás en HTTPS
  });
  return res.json({ message: 'Logout exitoso' });
});


