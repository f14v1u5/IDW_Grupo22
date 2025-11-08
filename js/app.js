<<<<<<< HEAD
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
=======
function cargaOpciones () {
    const loginSection = document.getElementById ('login-section');
    const loginForm = document.getElementById ('login-form');
    const adminPanel = document.getElementById ('admin-panel');
    const loginError = document.getElementById ('login-error');
    const botonLogout = document.getElementById ('btn-logout');

    // Si existe una sesion entonces,
    if(estaLogueado()) {

        if (loginSection) loginSection.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'block';
        if (botonLogout) botonLogout.addEventListener('click', logout);
        
    } else {
        if (adminPanel) adminPanel.style.display = 'none'; // Oculta el admin
        if (loginSection) loginSection.style.display = 'block'; // Muestra el login
        
        // Si no hay un usuario activo validaremos el elemento loginform y le agregaremos un escuchador para que cuando el usuario
        // de en Ingresar, no se recargue la pagine y se pueda controlar el ingreso
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Aseguramos que el mensaje de error esté oculto al iniciar el intento
                if (loginError) loginError.style.display = 'none';

                // Asignamos los valores de usuario y contraseña a las variables
                const usuario = document.getElementById('admin-usuario').value;
                const contrasenia = document.getElementById('admin-contrasenia').value;
                
                try {
                    await login(usuario, contrasenia);
                    window.location.reload()
                } catch (error) {
                if (loginError) {
                        // Muestra el error al usuario
                        loginError.textContent = error.message; 
                        loginError.style.display = 'block';
                    }
                }
            });
        }
    }
}

<<<<<<< HEAD
// Funcion que se aloja en el onclick del boton de 'Acciones'
window.editarMedico = function(id) {
  const medico = obtenerMedicos().find(m => m.id === id);
  if (medico) {
    idInput.value = medico.id;
    tituloINput.value = medico.titulo;
    nombreInput.value = medico.nombre;
    apellidoInput.value = medico.apellido;
    especialidadInput.value = medico.especialidad;
    descripcionInput.value = medico.descripcion;
  }
};

window.borrarMedico = function(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este médico?')) {
    eliminarMedico(id);
    renderTabla();
  }
};
=======
document.addEventListener('DOMContentLoaded', cargaOpciones);

>>>>>>> 6ed57d9 (Login con API REST y bifurcacion de opciones de administrador)
>>>>>>> flavio
