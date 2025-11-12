// Clave para manejar el localStorage
const MEDICOS_KEY = 'medicos_eventos';

// URL del JSON de médicos
const MEDICOS_JSON = '/data/medicos.json'; // <- Cambia según la ruta de tu JSON

// ------------------------------------------------------------------
// FUNCIONES DE DATOS INICIALES Y CONVERSION
// ------------------------------------------------------------------

// Funcion que carga los medicos desde el JSON externo
async function inicializarLocalStorage() {
    // Extraemos los medicos que ya existen en el localStorage
    const medicosEnStorage = obtenerMedicos(); //'[]'
    const idsEnStorage = medicosEnStorage.map(m => m.id); //'[]'
    let actualizados = [...medicosEnStorage]; //'[]'

    try {
        // Obtenemos los datos del JSON externo
        const response = await fetch(MEDICOS_JSON);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const medicosJSON = await response.json();

        // Recorremos los medicos obtenidos desde el JSON
        for (const medico of medicosJSON) {
            if (!idsEnStorage.includes(String(medico.id))) { // Si el medico no existe en storage
                try {
                    // Transformamos la imagen ruta a formato 'Base64' para almacenarlo en el LS
                    if (medico.imagenRuta) {
                        medico.imagenBase64 = await imagenUrlABase64(medico.imagenRuta);
                    }
                    // Incluimos al medico en 'actualizados'
                    actualizados.push(medico);
                } catch (err) {
                    console.error(`Error cargando imagen de ${medico.nombre}:`, err);
                }
            }
        }

        // Finalmente pasamos el array a la funcion
        guardarMedico(actualizados);

    } catch (error) {
        console.error("Error inicializando LocalStorage desde JSON:", error);
    }
}

// Funcion para transformar rutas a 'Base 64'
// NOS SIRVE PARA ALMACENAR LAS FOTOS EN EL localStorage
async function imagenUrlABase64(url) {
    try {
        // Asignamos la URL
        const response = await fetch(url);
        // Convertimos la URL en un Objeto Binario Grande (blob)
        const blob = await response.blob();

        // Con una promesa leemos el blob y las funciones nos devolveran el 'base64'
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error(`Error de fetch o CORS para la URL: ${url}`, error);
        return null; 
    }
}

// ------------------------------------------------------------------
// FUNCIONES GET Y SET
// ------------------------------------------------------------------

// FUNCION GET
function obtenerMedicos (){
    // Iniciamos una varible en la cual cargamos un JSON
    const info = localStorage.getItem(MEDICOS_KEY);
    // En caso de no existir datos, se opta por devolver un array vacio '|| []'
    return JSON.parse(info) || [];
}

// FUNCION SET
function guardarMedico (medicos) {
    // Se pasa por parametro un array y la funcion lo convierte en un JSON para almacenarlo
    localStorage.setItem(MEDICOS_KEY, JSON.stringify(medicos))
}

// ------------------------------------------------------------------
// CRUD
// ------------------------------------------------------------------

// Funcion para agregar medicos
function agregarMedico (medico) {
    // Extraemos la lista actual
    const medicos = obtenerMedicos();
    // Averiguamos si tiene un id y en caso de no le asignamos uno con 'crypto.randomUUID()'
    medico.id = medico.id || crypto.randomUUID()
    // Lo añadimos al array
    medicos.push(medico);
    // Lo guardamos
    guardarMedico(medicos)
}

// Funcion para actualizar medicos
function actualizarMedico (medicoActualizado) {
    const medicos = obtenerMedicos().map(medico => {
        if (medico.id === medicoActualizado.id) {
            return medicoActualizado
        } else {
            return medico
        }
    });
    guardarMedico(medicos);

}

// Funcion para eliminar medicos
function eliminarMedicoDeStorage(id) {
    // Extraemos la lista actual
    const medicos = obtenerMedicos();
    // Creamos una nueva lista excluyendo a ese medico que coincide el id obtenido por parametro
    // Para eso usamos el metodo '.filter'
    const medicosFiltrados = medicos.filter (medico => medico.id !==id);
    // Guardamos la nueva lista en el lS
    guardarMedico(medicosFiltrados);
}
