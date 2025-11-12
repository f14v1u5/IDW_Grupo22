// Clave para manejar el localStorage
const TURNOS_KEY = 'turnos_eventos';

// URL del JSON de turnos
const TURNOS_JSON = '/data/turnos.json';

// ------------------------------------------------------------------
// FUNCIONES DE DATOS INICIALES Y CONVERSION
// ------------------------------------------------------------------

async function inicializarLocalStorageTurnos() {
    const turnosEnStorage = obtenerTurnos();
    const idsEnStorage = turnosEnStorage.map(t => t.id);
    let actualizados = [...turnosEnStorage];

    try {
        const response = await fetch(TURNOS_JSON);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const turnosJSON = await response.json();

        for (const turno of turnosJSON) {
            if (!idsEnStorage.includes(String(turno.id))) {
                actualizados.push(turno);
            }
        }

        guardarTurnos(actualizados);

    } catch (error) {
        console.error("Error inicializando LocalStorage de turnos desde JSON:", error);
    }
}

// ------------------------------------------------------------------
// FUNCIONES GET Y SET
// ------------------------------------------------------------------

function obtenerTurnos() {
    const info = localStorage.getItem(TURNOS_KEY);
    return JSON.parse(info) || [];
}

function guardarTurnos(turnos) {
    localStorage.setItem(TURNOS_KEY, JSON.stringify(turnos));
}

// ------------------------------------------------------------------
// CRUD
// ------------------------------------------------------------------

function agregarTurno(turno) {
    const turnos = obtenerTurnos();
    turno.id = turno.id || crypto.randomUUID();
    turnos.push(turno);
    guardarTurnos(turnos);
}

function actualizarTurno(turnoActualizado) {
    const turnos = obtenerTurnos().map(t =>
        t.id === turnoActualizado.id ? turnoActualizado : t
    );
    guardarTurnos(turnos);
}

function eliminarTurnoDeStorage(id) {
    const turnos = obtenerTurnos();
    const turnosFiltrados = turnos.filter(t => t.id !== id);
    guardarTurnos(turnosFiltrados);
}
