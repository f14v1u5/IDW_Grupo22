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
    if (medicosEnStorage.length > 0) return; // No deberia sobreescribir si ya hay medicos cargados
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

// ==================================================================
// LÓGICA DEL DOM Y ARRANQUE DEL CRUD
// ==================================================================

// Referencias

let tabla;
let form;
let idInput;
let tituloInput;
let nombreInput;
let apellidoInput;
let especialidadInput;
let descripcionInput;
let imagenInput;

function iniciarCrudMedicos () {
    tabla = document.getElementById('tablaMedicos');
    form = document.getElementById('formMedicos');

    idInput = document.getElementById('medicoId');
    tituloInput = document.getElementById('titulo');
    nombreInput = document.getElementById('nombre');
    apellidoInput = document.getElementById('apellido');
    especialidadInput = document.getElementById('especialidad');
    descripcionInput = document.getElementById('descripcion');
    imagenInput = document.getElementById('imagen');

    if (form) {
        // Cuando el usuario da click en 'Guardar'
        form.addEventListener('submit', async function (event){
            event.preventDefault();

            await submitFormulario();

            if(tabla) renderizarTabla();
            });
    }
    inicializarLocalStorage()
            .then(() => {
                // 💡 Esta llamada es lo que faltaba para ver los datos en la tabla.
                if(tabla) renderizarTabla();
            })
            .catch(error => {
                console.error("Error al cargar datos de médicos:", error);
            });
}
window.iniciarCrudMedicos = iniciarCrudMedicos;

async function submitFormulario() {
    const id = idInput.value;
    const titulo = tituloInput.value;
    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;
    const especialidad = especialidadInput.value;
    const descripcion = descripcionInput.value;
    let imagenBase64 = null;

    // Convertimos el archivo pasado por el usuario a 'base64' en caso de haber subido una
    if (imagenInput.files.length > 0) { 
        try {
            imagenBase64 = await convertirArchivoABase64(imagenInput.files[0]);
        } catch (error) {
            console.error("Error al convertir la imagen:", error);
            alert("No se pudo cargar la imagen. Inténtalo de nuevo.");
            return; 
        } 
    // Si no conservamos la anterior en caso de tener
    } else if (id) {
        // Si estamos editando y no subimos nueva imagen, conservamos la anterior.
        const medicoOriginal = obtenerMedicos().find(m => m.id === id);
        imagenBase64 = medicoOriginal.imagenBase64; 
    }
    // Obtenemos el objeto con todos los datos del formulario
    const nuevoMedico = {
        id: id || null,
        titulo,
        nombre,
        apellido,
        especialidad,
        descripcion,
        imagenBase64: imagenBase64
    }
    // Si existe su el usuario solo estaba editando
    if (id) {
        actualizarMedico(nuevoMedico);
    // Si no existe el usuario estaba agregando un nuevo medico
    }else{
        agregarMedico(nuevoMedico)
    }
    // Reseteamos el formulario
    form.reset()
}

// Funcion que nos ayuda a visualizar los datos que cargamos
function renderizarTabla () {
    // Obtenemos la lista actual
    const medicos = obtenerMedicos();
    // Limpia la tabla de datos anteriores
    tabla.innerHTML = '';
    // Recorremos cada elemento del array obtenido y por cada uno de ellos:
    medicos.forEach(medico => {
        const imagenSrc = medico.imagenBase64 || medico.imagenRuta;
        // 2: Creamos un elemento html <tr>, una fila para la tabla
        const fila = document.createElement ('tr');
        // 3: Asignamos 'fila' las propiedades del objeto medico
        fila.innerHTML = `
            <td>
                <img src="${imagenSrc}" alt="Foto de ${medico.nombre}" width = "60" height = "60" style = "object-fit: cover; border-radius: 50%;"/>
            </td>
            <td>${medico.titulo} ${medico.nombre} ${medico.apellido}</td>
            <td>${medico.especialidad}</td>
            <td>${medico.descripcion}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editarMedico('${medico.id}')">Editar</button>
                <button class="btn btn-sm btn-danger me-2" onclick="eliminarMedico('${medico.id}')">Eliminar</button>
            </td>
        `;
        // 4: Incluimos la fila completa al cuerpo de la tabla
        tabla.appendChild(fila);
    });
}

// Esta funcion nos ayuda a transformar los archivos pasados por el usuario en el formulario y transformarlos a 'base64'
function convertirArchivoABase64(archivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(archivo);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Funcion que se aloja en el onclick del boton de 'Acciones'
window.eliminarMedico = function(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este médico?')) {
        eliminarMedicoDeStorage(id);
        renderizarTabla();
    }
}

// Funcion que se aloja en el onclick del boton de 'Acciones'
window.editarMedico = function(id) {
    const medicos = obtenerMedicos();
    const medicoAeditar = medicos.find (medico => medico.id === id);
    if (medicoAeditar) {
        idInput.value = medicoAeditar.id;
        tituloInput.value = medicoAeditar.titulo
        nombreInput.value = medicoAeditar.nombre;
        apellidoInput.value = medicoAeditar.apellido;
        especialidadInput.value = medicoAeditar.especialidad;
        descripcionInput.value = medicoAeditar.descripcion;
    }
}

