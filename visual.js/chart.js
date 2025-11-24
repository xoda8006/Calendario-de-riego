// Configuración para un gráfico de tipo doughnut con fondo personalizado
const config = {
  type: 'doughnut',
  data: data,
  options: {
    plugins: {
      customCanvasBackgroundColor: {
        color: 'lightGreen',
      }
    }
  },
  plugins: [plugin],
};

const customCanvasBackgroundColorPlugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
        const {ctx} = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || 'white'; // Color predeterminado
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
};


/**
 * Simula la obtención de datos de temperatura y humedad
 * con marca de tiempo para una semana, cada 3 minutos.
 * ESTA FUNCIÓN DEBE SER REEMPLAZADA por una llamada 'fetch' real 
 * a tu backend (e.g., usando http.js) que consulte la BD.
 * @returns {Array<Object>} Un array de datos simulados.
 */
function generateSimulatedData() {
    const readings = [];
    const baseDate = new Date(); 
    baseDate.setDate(baseDate.getDate() - 7); // Empezar hace 7 días
    
    const totalPoints = 7 * 24 * 20; // 7 días * 24 horas * 20 puntos/hora (cada 3 min)

    let currentTemp = 20;
    let currentHumid = 60;

    for (let i = 0; i < totalPoints; i++) {
        const timestamp = new Date(baseDate.getTime() + i * 3 * 60000); // 3 minutos en milisegundos

        // Simulación de fluctuación de datos
        currentTemp += (Math.random() - 0.5) * 0.2; // Pequeña variación
        currentHumid += (Math.random() - 0.5) * 0.5;

        // Limitar valores a rangos razonables
        currentTemp = Math.max(18, Math.min(30, currentTemp));
        currentHumid = Math.max(40, Math.min(80, currentHumid));

        readings.push({
            x: timestamp.toISOString(), // Chart.js espera formato ISO para 'time' scale
            temperatura: parseFloat(currentTemp.toFixed(1)),
            humedad: parseFloat(currentHumid.toFixed(1))
        });
    }
    return readings;
}


// ====================================================================
// 3. FUNCIÓN PRINCIPAL DE INICIALIZACIÓN DEL GRÁFICO
// ====================================================================

function initializeChart() {
    // 3.1. Obtener datos (Usando simulación - Reemplazar con fetch)
    const simulatedReadings = generateSimulatedData(); 

    // 3.2. Formatear datos para Chart.js
    const temperaturaData = simulatedReadings.map(item => ({ x: item.x, y: item.temperatura }));
    const humedadData = simulatedReadings.map(item => ({ x: item.x, y: item.humedad }));

    const data = {
        labels: [], // Se deja vacío para escala de tiempo
        datasets: [{
            label: 'Temperatura (°C)',
            data: temperaturaData,
            borderColor: 'rgb(255, 99, 132)', // Rojo
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.2,
            pointRadius: 0 // Ocultar puntos para no saturar el gráfico
        }, {
            label: 'Humedad (%)',
            data: humedadData,
            borderColor: 'rgb(54, 162, 235)', // Azul
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.2,
            pointRadius: 0
        }]
    };

    // 3.3. Configuración del Gráfico
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour', // Muestra las etiquetas principales por hora
                        tooltipFormat: 'dd/MM HH:mm', // Formato de fecha en el tooltip
                        displayFormats: {
                            hour: 'ddd HH:mm' // Formato de la etiqueta del eje (Ej: Lun 14:00)
                        }
                    },
                    title: {
                        display: true,
                        text: 'Fecha y Hora'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valor'
                    }
                }
            },
            plugins: {
                subtitle: {
                    display: true,
                    text: 'Datos temperatura y humedad',
                    font: { size: 14 }
                },
                customCanvasBackgroundColor: {
                    color: 'white' 
                }
            },
            // Tooltip avanzado para mostrar ambos valores juntos
            tooltips: {
                mode: 'index',
                intersect: false
            }
        },
        plugins: [customCanvasBackgroundColorPlugin]
    };

    // 3.4. Inicialización del Gráfico
    const canvasElement = document.getElementById('temperaturaHumedadChart'); 

    if (canvasElement && typeof Chart !== 'undefined') {
        try {
             // Asegurarse de que el contexto es '2d'
            const ctx = canvasElement.getContext('2d'); 
            if (ctx) {
                 window.myChart = new Chart(ctx, config); 
            } else {
                 console.error("No se pudo obtener el contexto 2D del canvas.");
            }
           
        } catch (error) {
             console.error("Error al inicializar Chart.js:", error);
        }
       
    } else {
        console.error("No se encontró el elemento canvas o la librería Chart.js no está cargada. Revise la consola del navegador.");
    }
}

// 🚨 La inicialización se hace al final del script.
initializeChart();