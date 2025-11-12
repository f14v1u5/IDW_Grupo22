// Clave para manejar el localStorage
const RESERVAS_KEY = 'reservas_eventos';

// URL del JSON de reservas
const RESERVAS_JSON = '/data/reservas.json';

// ------------------------------------------------------------------
// FUNCIONES DE DATOS INICIALES Y CONVERSION
// ------------------------------------------------------------------

async function inicializarLocalStorageReservas() {
    const reservasEnStorage = obtenerReservas();
    const idsEnStorage = reservasEnStorage.map(r => r.id);
    let actualizados = [...reservasEnStorage];

    try {
        const response = await fetch(RESERVAS_JSON);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const reservasJSON = await response.json();

        for (const reserva of reservasJSON) {
            if (!idsEnStorage.includes(String(reserva.id))) {
                actualizados.push(reserva);
            }
        }

        guardarReservas(actualizados);

    } catch (error) {
        console.error("Error inicializando LocalStorage de reservas desde JSON:", error);
    }
}

// ------------------------------------------------------------------
// FUNCIONES GET Y SET
// ------------------------------------------------------------------

function obtenerReservas() {
    const info = localStorage.getItem(RESERVAS_KEY);
    return JSON.parse(info) || [];
}

function guardarReservas(reservas) {
    localStorage.setItem(RESERVAS_KEY, JSON.stringify(reservas));
}

// ------------------------------------------------------------------
// CRUD
// ------------------------------------------------------------------

function agregarReserva(reserva) {
    const reservas = obtenerReservas();
    reserva.id = reserva.id || crypto.randomUUID();
    reservas.push(reserva);
    guardarReservas(reservas);
}

function actualizarReserva(reservaActualizada) {
    const reservas = obtenerReservas().map(r =>
        r.id === reservaActualizada.id ? reservaActualizada : r
    );
    guardarReservas(reservas);
}

function eliminarReservaDeStorage(id) {
    const reservas = obtenerReservas();
    const reservasFiltradas = reservas.filter(r => r.id !== id);
    guardarReservas(reservasFiltradas);
}
