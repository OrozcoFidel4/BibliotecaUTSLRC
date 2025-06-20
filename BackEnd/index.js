import express from 'express';
import cookieParser from 'cookie-parser';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();


 const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'libros',
}); 

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
    } else {
        console.log('Conexión a la base de datos establecida correctamente');
        connection.release();
    }
});


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));

app.listen(4000, () => {
    console.log('Servidor corriendo en el puerto 4000');
});


app.get('/libros', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM libros', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
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


