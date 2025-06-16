import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
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

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

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