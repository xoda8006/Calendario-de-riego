
import mysql from 'mysql'; 

const dbConfig = {
    host: '127.0.0.1',             
    user: 'root',                
    password: '',
     database: 'Calendario-de-Riego', 
        port: 3306                 
};

// 3. Crear la conexión
const db = mysql.createConnection(dbConfig);

// 4. Intentar conectar
db.connect((err) => {
    if (err) {
        // En caso de error, muestra el detalle. (Causas comunes: contraseña errónea o MySQL no iniciado)
        console.error('❌ Error al conectar a la Base de Datos:', err.stack);
        return;
    }
    console.log('✅ Conexión a MariaDB/MySQL exitosa con ID:', db.threadId);
});


export default db;