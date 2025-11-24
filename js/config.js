//config.js

import mysql from 'mysql'; 

const dbConfig = {
    host: '127.0.0.1',             
    user: 'root',                
    password: '',
     database: 'orquidiadb', 
        port: 3306                 
};


const db = mysql.createConnection(dbConfig);


db.connect((err) => {
    if (err) {
        console.error(' Error al conectar a la Base de Datos:', err.stack);
        return;
    }
    console.log('✅ Conexión a MariaDB/MySQL exitosa con ID:', db.threadId);
});


export default db;

