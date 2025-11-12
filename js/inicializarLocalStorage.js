// ------------------------------------------------------------------
// FUNCION GENERICA PARA INICIALIZAR LOCALSTORAGE CON JSON EXTERNOS
// ------------------------------------------------------------------
async function inicializarLocalStorage() {
    console.log('Se llamo a la función inicializarLocalStorage')
    try {
        // Definimos los archivos JSON y la clave de localStorage correspondiente
        const entidades = [
            { clave: 'medicos', archivo: 'data/medicos.json' },
            { clave: 'obrassoc', archivo: 'data/obrassoc.json' },
            { clave: 'reservas', archivo: 'data/reservas.json' },
            { clave: 'especialidades', archivo: 'data/especialidades.json' },
            { clave: 'turnos', archivo: 'data/turnos.json' }
            // Agregar nuevas entidades según se necesite
        ];

        for (const entidad of entidades) {
            // Solo cargamos si no existe en localStorage
            if (!localStorage.getItem(entidad.clave)) {
                const response = await fetch(entidad.archivo);
                if (!response.ok) {
                    throw new Error(`No se pudo cargar ${entidad.archivo}: ${response.statusText}`);
                }
                const datos = await response.json();
                localStorage.setItem(entidad.clave, JSON.stringify(datos));
                console.log(`LocalStorage inicializado para: ${entidad.clave}`);
            }
        }
    } catch (error) {
        console.error("Error al inicializar el localStorage:", error);
        throw error;
    }
}

// 🔹 Ejecutar cuando se cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
    inicializarLocalStorage();
});