function cargaReservas() {
    const tablaBody = document.getElementById('tablaReservas');

    if(!tablaBody){
        return;
    }
    try {
        // Obtener los datos de las reservas desde localStorage
        const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
        
        // Verificar si las reservas existen y son un arreglo
        if (!Array.isArray(reservas) || reservas.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="7">No hay reservas registradas.</td></tr>';
            return;
        }

        renderizarTablaUsuarios(reservas, tablaBody);
        
    } catch (error) {
        console.error("Error al obtener las reservas: ", error);
        tablaBody.innerHTML = `<tr><td colspan="7">Error al cargar las reservas: ${error.message}</td></tr>`;
    }
}

// Asignar la función a `window` para poder llamarla globalmente
window.cargaReservas = cargaReservas;

function renderizarTablaUsuarios(reservas, tablaBody) {
    tablaBody.innerHTML = ''; // Limpiar la tabla
    
    if (!Array.isArray(reservas) || reservas.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="7">No hay reservas registradas.</td></tr>';
        return;
    }

    reservas.forEach(reserva => {
        const fila = document.createElement('tr');
        const valorFormateado = reserva.valorTotal.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        });

        fila.innerHTML = `
            <td>${reserva.id}</td>
            <td>${reserva.documento}</td>
            <td>${reserva.paciente}</td>
            <td>${reserva.turno}</td>
            <td>${reserva.especialidad}</td>
            <td>${reserva.obraSocial}</td>
            <td><strong>${valorFormateado}</strong></td> 
        `;
        tablaBody.appendChild(fila);
    });
}


