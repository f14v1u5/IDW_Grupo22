const fs = require('fs');
const path = require('path');

// Ruta de las imágenes
const carpetaImagenes = `C:/Varios/(0_IDW)/IDW_022_v04.00/img/medicos`;

// JSON inicial con los médicos
const medicos = [
  { id: 1, matricula: 12345, apellido: "Martinez", nombre: "Ana", especialidad: 1, descripcion: "Especialista en corazón.", obrasSociales: [1, 2], fotografia: null, valorConsulta: 5000 },
  { id: 2, matricula: 67890, apellido: "Fernandez", nombre: "Laura", especialidad: 2, descripcion: "Cuidado de piel y cabello.", obrasSociales: [2], fotografia: null, valorConsulta: 4500 },
  { id: 3, matricula: 54321, apellido: "Gonzalez", nombre: "Pablo", especialidad: 3, descripcion: "Especialista en sistema nervioso.", obrasSociales: [1, 3], fotografia: null, valorConsulta: 6000 }
];

// Función para convertir cada imagen a Base64
medicos.forEach(medico => {
    const nombreArchivo = `${medico.nombre.toLowerCase()}_${medico.apellido.toLowerCase()}.jpg`;
    const rutaImagen = path.join(carpetaImagenes, nombreArchivo);

    try {
        const imagenBuffer = fs.readFileSync(rutaImagen);
        const imagenBase64 = imagenBuffer.toString('base64');
        medico.fotografia = `data:image/jpeg;base64,${imagenBase64}`;
    } catch (error) {
        console.error(`No se pudo leer la imagen para ${medico.nombre} ${medico.apellido}:`, error.message);
        medico.fotografia = null;
    }
});

// Guardamos el JSON final con las imágenes en Base64
fs.writeFileSync('medicos_base64.json', JSON.stringify(medicos, null, 2), 'utf8');

console.log('JSON generado con imágenes en Base64!');
