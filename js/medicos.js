export const MEDICOS_KEY = 'medicos_eventos';

// Datos iniciales de los médicos. Si no están cargados en el localStorage, los carga desde aquí
const medicosIniciales = [
  {
    id: '1',
    titulo: 'Dra.',
    nombre: 'Ana',
    apellido: 'Martínez',
    especialidad: 'Especialista en Cardiología',
    descripcion: 'Médico especializado en la prevención, diagnóstico y tratamiento de enfermedades del corazón y del sistema circulatorio.',
    imagenBase64: null,
    imagenRuta: '/img/medicos/ana_martinez.jpg'
  },
  {
    id: '2',
    titulo: 'Dra.',
    nombre: 'Laura',
    apellido: 'Fernández',
    especialidad: 'Especialista en Dermatología',
    descripcion: 'Médica enfocada en el cuidado de la piel, el cabello y las uñas.',
    imagenBase64: null,
    imagenRuta: '/img/medicos/laura_fernandez.jpg'
  },
  {
    id: '3',
    titulo: 'Dr.',
    nombre: 'Pablo',
    apellido: 'González',
    especialidad: 'Especialista en Neurología',
    descripcion: 'Médica especialista en el diagnóstico y tratamiento de enfermedades del sistema nervioso. ',
    imagenBase64: null,
    imagenRuta: '/img/medicos/pablo_gonzalez.jpg'
  }
];

// Función para convertir y cargar una imagen al localStorage 
async function imagenUrlABase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

// Carga los datos desde el diccionario, recorre y, si no está en el localStorage, lo carga.
export async function inicializarLocalStorage() {
  const medicosEnStorage = obtenerMedicos();
  const idsEnStorage = medicosEnStorage.map(m => m.id);
  let actualizados = [...medicosEnStorage];

  for (const medico of medicosIniciales) {
    if (!idsEnStorage.includes(medico.id)) {
      try {
        medico.imagenBase64 = await imagenUrlABase64(medico.imagenRuta);
        actualizados.push(medico);
      } catch (err) {
        console.error(`Error cargando imagen de ${medico.nombre}:`, err);
      }
    }
  }

  guardarMedicos(actualizados);
}

export function obtenerMedicos() {
  return JSON.parse(localStorage.getItem(MEDICOS_KEY)) || [];
}

export function guardarMedicos(medicos) {
  localStorage.setItem(MEDICOS_KEY, JSON.stringify(medicos));
}

export function agregarMedico(medico) {
  const medicos = obtenerMedicos();
  medico.id = medico.id || crypto.randomUUID();
  medicos.push(medico);
  guardarMedicos(medicos);
}

export function eliminarMedico(id) {
  const medicos = obtenerMedicos().filter(medico => medico.id !== id);
  guardarMedicos(medicos);
}

export function actualizarMedico(medicoActualizado) {
  const medicos = obtenerMedicos().map(medico =>
    medico.id === medicoActualizado.id ? medicoActualizado : medico
  );
  guardarMedicos(medicos);
}
