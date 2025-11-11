// ---- LOGIN ----
const access_Token = 'accessToken';

async function login(user, contra) {
    try {
        const respuesta = await fetch ('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: user,
                password: contra,
            }),
        });

    if (!respuesta.ok) {
        throw new Error ('Usuario o contraseña incorrectos.');
    }

    const datos = await respuesta.json();
    sessionStorage.setItem(access_Token, datos.token);

    return true;
    } catch (error) {
        throw error;
    }
}

// ---- CONTROL DE SESIÓN ----
function estaLogueado () {
    return sessionStorage.getItem(access_Token) !== null;
}

function logout () {
    sessionStorage.removeItem(access_Token);
    window.location.reload();
}

function volverAtras () {
    
}

// ---- PANTALLA DE LOGIN Y PANEL ----
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
document.addEventListener('DOMContentLoaded', cargaOpciones);

