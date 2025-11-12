// Clave para manejar el localStorage
const OBRAS_KEY = 'obras_eventos';

// URL del JSON de obras sociales
const OBRAS_JSON = '/data/obrasSociales.json';

// ------------------------------------------------------------------
// FUNCIONES DE DATOS INICIALES Y CONVERSION
// ------------------------------------------------------------------

async function inicializarLocalStorageObras() {
    const obrasEnStorage = obtenerObras();
    const idsEnStorage = obrasEnStorage.map(o => o.id);
    let actualizados = [...obrasEnStorage];

    try {
        const response = await fetch(OBRAS_JSON);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const obrasJSON = await response.json();

        for (const obra of obrasJSON) {
            if (!idsEnStorage.includes(String(obra.id))) {
                actualizados.push(obra);
            }
        }

        guardarObras(actualizados);

    } catch (error) {
        console.error("Error inicializando LocalStorage de obras sociales desde JSON:", error);
    }
}

// ------------------------------------------------------------------
// FUNCIONES GET Y SET
// ------------------------------------------------------------------

function obtenerObras() {
    const info = localStorage.getItem(OBRAS_KEY);
    return JSON.parse(info) || [];
}

function guardarObras(obras) {
    localStorage.setItem(OBRAS_KEY, JSON.stringify(obras));
}

// ------------------------------------------------------------------
// CRUD
// ------------------------------------------------------------------

function agregarObra(obra) {
    const obras = obtenerObras();
    obra.id = obra.id || crypto.randomUUID();
    obras.push(obra);
    guardarObras(obras);
}

function actualizarObra(obraActualizada) {
    const obras = obtenerObras().map(o =>
        o.id === obraActualizada.id ? obraActualizada : o
    );
    guardarObras(obras);
}

function eliminarObraDeStorage(id) {
    const obras = obtenerObras();
    const obrasFiltradas = obras.filter(o => o.id !== id);
    guardarObras(obrasFiltradas);
}
