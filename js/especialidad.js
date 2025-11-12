// Clave para manejar el localStorage
const ESPECIALIDADES_KEY = 'especialidades_eventos';

// URL del JSON de especialidades
const ESPECIALIDADES_JSON = '/data/especialidades.json';

// ------------------------------------------------------------------
// FUNCIONES DE DATOS INICIALES Y CONVERSION
// ------------------------------------------------------------------

async function inicializarLocalStorageEspecialidades() {
    // Extraemos las especialidades que ya existen en el localStorage
    const especialidadesEnStorage = obtenerEspecialidades(); //'[]'
    const idsEnStorage = especialidadesEnStorage.map(e => e.id); //'[]'
    let actualizados = [...especialidadesEnStorage]; //'[]'

    try {
        // Obtenemos los datos del JSON externo
        const response = await fetch(ESPECIALIDADES_JSON);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const especialidadesJSON = await response.json();

        // Recorremos las especialidades obtenidas desde el JSON
        for (const especialidad of especialidadesJSON) {
            if (!idsEnStorage.includes(String(especialidad.id))) { // Si no existe en storage
                // Incluimos en 'actualizados'
                actualizados.push(especialidad);
            }
        }

        // Finalmente pasamos el array a la funcion
        guardarEspecialidades(actualizados);

    } catch (error) {
        console.error("Error inicializando LocalStorage de especialidades desde JSON:", error);
    }
}

// ------------------------------------------------------------------
// FUNCIONES GET Y SET
// ------------------------------------------------------------------

// FUNCION GET
function obtenerEspecialidades (){
    const info = localStorage.getItem(ESPECIALIDADES_KEY);
    return JSON.parse(info) || [];
}

// FUNCION SET
function guardarEspecialidades (especialidades) {
    localStorage.setItem(ESPECIALIDADES_KEY, JSON.stringify(especialidades))
}

// ------------------------------------------------------------------
// CRUD
// ------------------------------------------------------------------

function agregarEspecialidad (especialidad) {
    const especialidades = obtenerEspecialidades();
    especialidad.id = especialidad.id || crypto.randomUUID()
    especialidades.push(especialidad);
    guardarEspecialidades(especialidades);
}

function actualizarEspecialidad (especialidadActualizada) {
    const especialidades = obtenerEspecialidades().map(e => 
        e.id === especialidadActualizada.id ? especialidadActualizada : e
    );
    guardarEspecialidades(especialidades);
}

function eliminarEspecialidadDeStorage(id) {
    const especialidades = obtenerEspecialidades();
    const especialidadesFiltradas = especialidades.filter(e => e.id !== id);
    guardarEspecialidades(especialidadesFiltradas);
}
