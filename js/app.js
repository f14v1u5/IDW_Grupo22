import {
  inicializarLocalStorage,
  obtenerMedicos,
  agregarMedico,
  eliminarMedico,
  actualizarMedico
} from './medicos.js';

const tabla = document.getElementById('tablaMedicos');
const form = document.getElementById('formMedicos');

const idInput = document.getElementById('medicoId');
const tituloInput = document.getElementById('titulo');
const nombreInput = document.getElementById('nombre');
const apellidoInput = document.getElementById('apellido');
const especialidadInput = document.getElementById('especialidad');
const descripcionInput = document.getElementById('descripcion');
const imagenInput = document.getElementById('imagen');

await inicializarLocalStorage();
renderTabla();

form.addEventListener('submit', async e => {
  e.preventDefault();

  let imagenBase64 = null;
  if (imagenInput.files && imagenInput.files[0]) {
    imagenBase64 = await convertirArchivoABase64(imagenInput.files[0]);
  }

  const nombreNormalizado = nombreInput.value.trim().toLowerCase().replace(/ /g, '_');
  const apellidoNormalizado = apellidoInput.value.trim().toLowerCase().replace(/ /g, '_');
  const imagenRuta = `/img/medicos/${nombreNormalizado}_${apellidoNormalizado}.jpg`;

  const medico = {
    id: idInput.value || crypto.randomUUID(),
    titulo: tituloInput.value.trim(),
    nombre: nombreInput.value.trim(),
    apellido: apellidoInput.value.trim(),
    especialidad: especialidadInput.value.trim(),
    descripcion: descripcionInput.value.trim(),
    imagenBase64: imagenBase64,
    imagenRuta: imagenRuta
  };

  if (idInput.value) {
    actualizarMedico(medico);
  } else {
    agregarMedico(medico);
  }

  form.reset();
  renderTabla();
});

function renderTabla() {
  const medicos = obtenerMedicos();
  tabla.innerHTML = '';

  medicos.forEach(medico => {
    const imagenSrc = medico.imagenBase64 || medico.imagenRuta;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>
        <img src="${imagenSrc}" alt="Foto de ${medico.nombre} ${medico.apellido}" width="60" height="60" style="object-fit: cover; border-radius: 50%;" />
      </td>
      <td>${medico.titulo} ${medico.nombre} ${medico.apellido}</td>
      <td>${medico.especialidad}</td>
      <td>${medico.descripcion}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editarMedico('${medico.id}')">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="borrarMedico('${medico.id}')">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

function convertirArchivoABase64(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

window.editarMedico = function(id) {
  const medico = obtenerMedicos().find(m => m.id === id);
  if (medico) {
    idInput.value = medico.id;
    tituloInput.value = medico.titulo;
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
