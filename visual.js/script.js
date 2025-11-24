// visual/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Al cargar la página, se llama a la función principal para obtener y mostrar los datos.
    fetchOrquideas();
});

// Función que se comunica con el servidor para obtener los datos
async function fetchOrquideas() {
    const listaDiv = document.getElementById('lista_orquideas');
    listaDiv.innerHTML = '<h3>Cargando Orquídeas...</h3>'; 

    try {
        // Llama a la ruta GET que creaste en http.js
        const response = await fetch('/api/orquideas');
        
        if (!response.ok) {
            // Manejo de error si el servidor no devuelve 200 OK
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }
        
        const orquideas = await response.json();
        
        // Pasa los datos a la función de renderizado
        renderOrquideas(orquideas, listaDiv); 

    } catch (error) {
        console.error('Error al cargar la lista de orquídeas:', error);
        // Muestra el error de forma visual en la interfaz
        listaDiv.innerHTML = `<p style="color: red;">⚠️ Error al obtener datos del servidor: ${error.message}</p>`;
    }

}



// ===============================
// POST → Agregar nueva orquídea
// ===============================
async function agregarOrquidea() {
    const nombre = document.getElementById('nombre').value.trim();
    const frecuencia = document.getElementById('frecuencia').value.trim();
    const observaciones = document.getElementById('observaciones').value.trim();

    // Validación simple
    if (!nombre || !frecuencia) {
        alert("Nombre y frecuencia son obligatorios.");
        return;
    }

    // Crear objeto para enviar
    const nuevaOrquidea = {
        nombre,
        frecuencia,
        observaciones
    };

    try {
        const response = await fetch('/api/orquideas', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaOrquidea)
        });

        if (!response.ok) {
            throw new Error(`Error al guardar: ${response.status}`);
        }

        // Limpiar formulario
        document.getElementById('nombre').value = "";
        document.getElementById('frecuencia').value = "";
        document.getElementById('observaciones').value = "";

        // Recargar tabla sin recargar la página
        fetchOrquideas();

        alert("Orquídea agregada correctamente.");

    } catch (error) {
        alert("No se pudo agregar: " + error.message);
    }
}
















// Función que construye la estructura de la tabla HTML
function renderOrquideas(orquideas) {

    const tbody = document.querySelector("#excelTable tbody");

    // Si no hay datos
    if (!orquideas || orquideas.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6'>Aún no hay orquídeas registradas.</td></tr>";
        return;
    }

    let filasHTML = "";

    orquideas.forEach(o => {
        const fechaRiego = o.ultima_fecha
            ? new Date(o.ultima_fecha).toLocaleDateString("es-CL")
            : "N/A";

        filasHTML += `
            <tr>
                <td>${o.id}</td>
                <td>${o.nombre}</td>
                <td>${fechaRiego}</td>
                <td>${o.frecuencia}</td>
                <td>${o.observaciones || ""}</td>
                <td>${o.creado_en || ""}</td>
            </tr>
        `;
    });

    // Insertar filas en la tabla
    tbody.innerHTML = filasHTML;
}
