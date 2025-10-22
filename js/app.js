inicializarLocalStorage()
    .then(() => {
        // Al terminar de iniciar el ls y cargar las imagenes se ejecuta:
        console.log("Datos iniciales cargados correctamente.");
        renderizarTabla();
    })
    .catch(error => {
        console.error("Error al inicializar el localStorage:", error);
    });


// REFERENCIAS  
const tabla = document.getElementById('tablaMedicos');
const form = document.getElementById('formMedicos');


const idInput = document.getElementById('medicoId');
const tituloInput = document.getElementById('titulo');
const nombreInput = document.getElementById('nombre');
const apellidoInput = document.getElementById('apellido');
const especialidadInput = document.getElementById('especialidad');
const descripcionInput = document.getElementById('descripcion');
const imagenInput = document.getElementById('imagen');


// Cuando el usuario da click en 'Guardar'
form.addEventListener('submit', async function (event){
    event.preventDefault();
    // Extraemos los datos del formulario
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
    ;
    renderizarTabla();
    })

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
                <img src="${imagenSrc}" alt="Foto de ${medico.nombre}" width = "60" height = "60" style = "objet-fit: cover; border-radius: 50%;"/>
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

renderizarTabla();

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
