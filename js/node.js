import { createServer } from 'node:http';
import { readFile } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import db from './config.js'; 

const PORT = 3307; 
const HOST = '127.0.0.1';

// Definición de rutas para encontrar archivos
const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename); 
const projectRoot = path.resolve(currentDir, '..'); 
const visualPath = path.join(projectRoot, 'visual');

// ====================================================================
// LÓGICA DE SIMULACIÓN (ESTO IMITA LA LECTURA DEL SENSOR/BD)
// ====================================================================

/**
 * Simula la obtención de datos para la última lectura del dashboard.
 * @returns {object} { temperatura, humedadAire, humedadSuelo }
 */
function getLatestSensorData() {
    // Nota: Estos valores se actualizarán cada 5 segundos en el dashboard.
    return {
        temperatura: (20 + Math.random() * 5).toFixed(1), // Ejemplo: 20.0 a 25.0 °C
        humedadAire: (50 + Math.random() * 15).toFixed(1), // Ejemplo: 50.0 a 65.0 %
        humedadSuelo: (35 + Math.random() * 30).toFixed(1), // Ejemplo: 35.0 a 65.0 %
    };
}

/**
 * Simula la obtención de datos históricos (7 días, cada 3 minutos) para el gráfico.
 * @returns {Array<Object>} Lista de lecturas históricas.
 */
function getHistoricalSensorData() {
    const readings = [];
    const baseDate = new Date(); 
    baseDate.setDate(baseDate.getDate() - 7); // Empezar hace 7 días
    
    const totalPoints = 7 * 24 * 20; // 3360 puntos totales
    let currentTemp = 20;
    let currentHumid = 60;
    let currentSoil = 50;

    for (let i = 0; i < totalPoints; i++) {
        const timestamp = new Date(baseDate.getTime() + i * 3 * 60000); // 3 minutos en milisegundos

        // Simulación de fluctuación
        currentTemp += (Math.random() - 0.5) * 0.2; 
        currentHumid += (Math.random() - 0.5) * 0.5;
        currentSoil += (Math.random() - 0.5) * 0.8;

        // Limitar valores a rangos razonables
        currentTemp = Math.max(18, Math.min(30, currentTemp));
        currentHumid = Math.max(40, Math.min(80, currentHumid));
        currentSoil = Math.max(30, Math.min(75, currentSoil));

        readings.push({
            x: timestamp.toISOString(), // Formato ISO para Chart.js
            temperatura: parseFloat(currentTemp.toFixed(1)),
            humedad: parseFloat(currentHumid.toFixed(1)),
            humedadSuelo: parseFloat(currentSoil.toFixed(1))
        });
    }
    return readings;
}

// --- FUNCIÓN DE PARSEO DE BODY (Maneja datos POST) ---
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const params = new URLSearchParams(body);
                const data = {};
                for (const [key, value] of params.entries()) { data[key] = value; }
                resolve(data);
            } catch (err) { reject(err); }
        });
    });
}

// --- FUNCIÓN PARA SERVIR ARCHIVOS ESTÁTICOS (HTML, JS, CSS) ---
function serveStaticFile(res, filepath, contentType) {
    readFile(filepath, (err, data) => {
        if (err) {
            console.error(`Error al leer archivo ${filepath}:`, err);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Archivo no encontrado.');
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}


const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // --- MANEJO DE ARCHIVOS ESTÁTICOS ---
    
    // 1. Manejo de la página principal
    if (pathname === '/visual/index.html' || pathname === '/') {
        const filePath = path.join(visualPath, 'index.html');
        return serveStaticFile(res, filePath, 'text/html');
    }
    
    // 2. Manejo de archivos en la carpeta /visual/ (como chart.js)
    if (pathname.startsWith('/visual/')) {
        const fileExtension = path.extname(pathname);
        let contentType = 'application/octet-stream';

        if (fileExtension === '.js') contentType = 'application/javascript';
        if (fileExtension === '.css') contentType = 'text/css';

        const fileName = path.basename(pathname);
        const filePath = path.join(visualPath, fileName);
        return serveStaticFile(res, filePath, contentType);
    }
    
    // 3. Manejo de archivos en la raíz del proyecto (script.js, Visual.css)
    if (pathname === '/script.js' || pathname === '/Visual.css') {
         const fileExtension = path.extname(pathname);
         let contentType = 'application/octet-stream';

         if (fileExtension === '.js') contentType = 'application/javascript';
         if (fileExtension === '.css') contentType = 'text/css';

         const filePath = path.join(projectRoot, pathname); // Busca en la raíz del proyecto
         return serveStaticFile(res, filePath, contentType);
    }


    // --- 🚨 RUTAS API PARA SENSORES (SIMULADAS) 🚨 ---
    
    // 6. RUTA GET: OBTENER ÚLTIMA LECTURA (Dashboard)
    if (req.method === 'GET' && pathname === '/api/lectura_actual') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(getLatestSensorData()));
    }
    
    // 7. RUTA GET: OBTENER DATOS HISTÓRICOS (Gráfico)
    if (req.method === 'GET' && pathname === '/api/historico_semanal') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(getHistoricalSensorData()));
    }

    // --- MANEJO DE BD (CRUD) ---
    
    // 3. RUTA POST: AGREGAR ORQUÍDEA (CREATE)
    if (req.method === 'POST' && pathname === '/agregar_orquidea') {
        try {
            const data = await parseBody(req); 
            const { nombre, ultima_fecha, frecuencia, observaciones } = data;
            
            // Reemplaza 'calendario-de-riego' con el nombre real de tu tabla si es diferente
            const query = 'INSERT INTO `calendario-de-riego` (nombre, ultima_fecha, frecuencia, observaciones) VALUES (?, ?, ?, ?)';
            
            db.query(query, [nombre, ultima_fecha, frecuencia, observaciones], (err, result) => {
                if (err) {
                    console.error('Error al insertar en la BD:', err); 
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end('Error al guardar los datos en la BD.');
                }
                console.log('Orquídea agregada con ID:', result.insertId);
                
                // 🚨 CORRECCIÓN: Devolvemos un 200 OK simple para que AJAX lo maneje 🚨
                res.writeHead(200, { 'Content-Type': 'application/json' }); 
                res.end(JSON.stringify({ success: true, id: result.insertId }));
            });

        } catch (error) {
            console.error('Error al procesar el POST:', error);
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Error en el formato de los datos.');
        }
        return;
    }

    // 4. RUTA GET: OBTENER LISTA DE ORQUÍDEAS (READ / API)
    if (req.method === 'GET' && pathname === '/api/orquideas') {
        const query = 'SELECT * FROM `calendario-de-riego` ORDER BY nombre ASC';
        
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al consultar la BD:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Error al obtener la lista.' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
        return;
    }

    // 5. Ruta no encontrada (404)
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no encontrada');
});


// --- INICIAR EL SERVIDOR ---
server.listen(PORT, HOST, () => {
    console.log(`Servidor de Orquidia corriendo en http://${HOST}:${PORT}`);
});