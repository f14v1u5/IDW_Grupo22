const API_URL = 'https://dummyjson.com/users';

function cargaUsuarios() {
    console.log("Iniciando carga de usarios...");
    const tabla = document.getElementById('tablaUsuarios');

    if(!tabla) {
        return;
    }
    (async () => {
        try {
            const respuesta = await fetch(API_URL)

            if(!respuesta.ok) {
                throw new Error ('Error en la peticion')
            }

            const data = await respuesta.json();

            if(data && Array.isArray(data.users)) {
                renderizarTablaUsuarios (data.users, tabla);
            }else {
                tabla.innerHTML = '<tr><td colspan = "7">No se pudo obtener la lista de usuarios.</td></tr>';
            }

        } catch (error){
            console.error("Error al obtener los usuarios: ", error);
            tabla.innerHTML = `<tr><td colspan="7">Error de conexión: ${error.message}</td></tr>`;
        }
    })();
}

window.cargarUsuarios = cargarUsuarios;

function renderizarTablaUsuarios(usuarios, tabla) {
    tabla.innerHTML = ''; // Limpiar la tabla
    
    usuarios.forEach(user => {
        // Recorremos cada ususario para extraer los datos necesarios
        const { id, firstName, lastName, username, email, phone, age, address } = user;
        
        const ciudad = address && address.city ? address.city : 'N/A';

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${id}</td>
            <td>${firstName} ${lastName}</td>
            <td>${username}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${age}</td>
            <td>${ciudad}</td>
        `;
        tabla.appendChild(fila);
    });

    console.log(`Tabla renderizada con ${usuarios.length} usuarios.`);
}