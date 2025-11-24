// visual/script.js

document.addEventListener('DOMContentLoaded', () => {
    fetchOrquideas();
});

async function fetchOrquideas() {
    const listaDiv = document.getElementById('lista_orquideas');
    listaDiv.innerHTML = '<h3>Cargando Orquídeas...</h3>'; 

    try {
      
        const response = await fetch('/api/orquideas');
        
        if (!response.ok) {
            // Manejo de error si el servidor no devuelve 200 OK
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }
        
        const orquideas = await response.json();
        
        
        renderOrquideas(orquideas, listaDiv); 

    } catch (error) {
        console.error('Error al cargar la lista de orquídeas:', error);
        // Muestra el error de forma visual en la interfaz
        listaDiv.innerHTML = `<p style="color: red;">⚠️ Error al obtener datos del servidor: ${error.message}</p>`;
    }
}


function renderOrquideas(orquideas, container) {
    if (orquideas.length === 0) {
        container.innerHTML = '<h3>Orquídeas Registradas</h3><p>Aún no hay orquídeas en el sistema.</p>';
        return;
    }

    let html = '<h3>Orquídeas Registradas</h3>';
    
   
    html += '<table border="1" style="width: 100%; border-collapse: collapse; margin-top: 15px;">';
    html += '<thead><tr><th>Nombre</th><th>Último Riego</th><th>Frecuencia (Días)</th><th>Observaciones</th></tr></thead><tbody>';

    orquideas.forEach(orquidea => {
      
        const fechaRiego = orquidea.ultima_fecha ? new Date(orquidea.ultima_fecha).toLocaleDateString('es-CL') : 'N/A';
        
        html += `
            <tr>
                <td>${orquidea.nombre}</td>
                <td>${fechaRiego}</td>
                <td>${orquidea.frecuencia}</td>
                <td>${orquidea.observaciones || ''}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    
    container.innerHTML = html; // Muestra la tabla en el div
}