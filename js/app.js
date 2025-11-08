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
