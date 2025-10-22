// Clave para manejar el localStorage
const MEDICOS_KEY = 'medicos_eventos';

// Medicos iniciales por default
const medicosIniciales = [
    { id: '1', titulo: 'Dra.', nombre: 'Ana', apellido: 'Martínez', especialidad: 'Cardiología', descripcion: 'Especialista en corazón.', imagenBase64: null, imagenRuta: '/img/medicos/ana_martinez.jpg' },
    { id: '2', titulo: 'Dra.', nombre: 'Laura', apellido: 'Fernández', especialidad: 'Dermatología', descripcion: 'Cuidado de piel y cabello.', imagenBase64: null, imagenRuta: '/img/medicos/laura_fernandez.jpg' },
    { id: '3', titulo: 'Dr.', nombre: 'Pablo', apellido: 'González', especialidad: 'Neurología', descripcion: 'Especialista en sistema nervioso.', imagenBase64: null, imagenRuta: '/img/medicos/pablo_gonzalez.jpg' }
]

// ------------------------------------------------------------------
// FUNCIONES DE DATOS INICIALES Y CONVERSION
// ------------------------------------------------------------------

// Funcion que carga los medicos de 'medicosIniciales'
async function inicializarLocalStorage() {
    const medicosEnStorage = obtenerMedicos(); //'[]'
    const idsEnStorage = medicosEnStorage.map(m => m.id); //'[]'
    let actualizados = [...medicosEnStorage]; //'[]'

    // Recorremos los id´s de los medicosIniciales y como ninguno esta en idsEnStorage entonces los agrega
    for (const medico of medicosIniciales) {
        if (!idsEnStorage.includes(medico.id)) {
        try {
            // Transformamos la imagen ruta a formato 'Base64' para almacenarlo en el lS
            medico.imagenBase64 = await imagenUrlABase64(medico.imagenRuta);
            // Incluimos al medico en 'actualizados'
            actualizados.push(medico);
        } catch (err) {
            console.error(`Error cargando imagen de ${medico.nombre}:`, err);
        }
        }
    }
    // Finalmente pasamos el array a la funcion
    guardarMedico(actualizados);
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



