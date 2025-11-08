const access_Token = 'accessToken';

async function login(user, contra) {
    try {
        const respuesta = await fetch ('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: user,
                password: contra,
            })
        });
    if (!respuesta.ok) {
        throw new Error ('Usuario o contraseña incorrectos.');
    }
    const datos = await respuesta.json();
    sessionStorage.setItem(access_Token, datos.token)

    return true;
    } catch (error) {
        throw error;
    }
}

function estaLogueado () {
    return sessionStorage.getItem(access_Token) !== null;
}

function logout () {
    sessionStorage.removeItem(access_Token);
    window.location.reload();
}

function volverAtras () {
    
}

































/*
// Funcion para iniciar el Local Storage
function checkSesion () {
    return localStorage.getItem('admin_logged_in') === 'true';
}


// Funcion que valida las credenciales
function login (user, pass) {
    if (user === ADMIN_CREDENCIALES.usuario && pass === ADMIN_CREDENCIALES.contrasenia){
        localStorage.setItem('admin_logged_in', 'true');
        return true;
        }else;
            return false;
}

// Funcion para salir de la sesion
function logout () {
    localStorage.removeItem('admin_logged_in');
    window.location.reload();
}


// Funcion para cargar panel de administracion
function cargaPanel () {
    const loginForm = document.getElementById ('login-section');
    const adminPanel = document.getElementById ('admin-panel');
    const loginError = document.getElementById ('login-error');
    const botonLogout = document.getElementById ('btn-logout');

    // Si existe una sesion entonces,
    if(checkSesion()) {
        // Comprobamos que exista el elemento 'loginform' y ocultamos el formulario que trae consigo y,
        if (loginForm) loginForm.style.display = 'none';
        // Habilitamos el panel de administracion
            adminPanel.style.display = 'block';
        // Habilitamos tambien el boton de cierre de sesion
        if (botonLogout) botonLogout.addEventListener('click', logout);

    } else {
        // Si no hay un usuario activo validaremos el elemento loginform y le agregaremos un escuchador para que cuando el usuario
        // de en Ingresar, no se recargue la pagine y se pueda controlar el ingreso
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Asignamos los valores de usuario y contraseña a las variables
                const usuario = document.getElementById('admin-usuario').value;
                const contrasenia = document.getElementById('admin-contrasenia').value;

                // Validamos los datos
                if (login(usuario, contrasenia)) {
                    window.location.reload();
                } else {
                    loginError.style.display = 'block'
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', cargaPanel);
*/



