// js/http.js

import { createServer } from 'node:http';
import { readFile } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import db from './config.js'; // Conexión a la BD

const PORT = 3006; 
const HOST = '127.0.0.1';

// Definición de rutas para encontrar archivos
const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename); 
const projectRoot = path.resolve(currentDir, '..'); 
const visualPath = path.join(projectRoot, 'visual');

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

// --- FUNCIÓN PARA SERVIR ARCHIVOS ESTÁTICOS (HTML, JS) ---
function serveStaticFile(res, filepath, contentType) {
    readFile(filepath, (err, data) => {
        if (err) {
            console.error(`Error al leer archivo ${filepath}:`, err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Error interno del servidor al cargar el archivo.');
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}


const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // 1. Manejo de archivos estáticos (HTML)
    if (pathname === '/visual/index.html' || pathname === '/') {
        const filePath = path.join(visualPath, 'index.html');
        return serveStaticFile(res, filePath, 'text/html');
    }
    
    // 2. Manejo del script.js (¡Ahora busca correctamente en /visual/script.js!)
    if (pathname === '/visual/script.js') { 
        const filePath = path.join(visualPath, 'script.js');
        return serveStaticFile(res, filePath, 'application/javascript');
    }
    
    // 3. RUTA POST: AGREGAR ORQUÍDEA (CREATE)
    if (req.method === 'POST' && pathname === '/agregar_orquidea') {
        try {
            const data = await parseBody(req); 
            const { nombre, ultima_fecha, frecuencia, observaciones } = data;
            
            // Usando el nombre de tabla correcto
            const query = 'INSERT INTO `calendario_riego` (nombre, ultima_fecha, frecuencia, observaciones) VALUES (?, ?, ?, ?)';
            
            db.query(query, [nombre, ultima_fecha, frecuencia, observaciones], (err, result) => {
                if (err) {
                    console.error('Error al insertar en la BD:', err); 
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end('Error al guardar los datos en la BD.');
                }
                console.log('Orquídea agregada con ID:', result.insertId);
                res.writeHead(302, { 'Location': '/visual/index.html' });
                res.end();
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
        // Usando el nombre de tabla correcto para la consulta
        const query = 'SELECT * FROM `calendario_riego` ORDER BY nombre ASC';
        
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