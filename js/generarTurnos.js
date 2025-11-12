function siguienteLunes(fecha) {
  const dia = fecha.getDay();
  const diasParaLunes = (dia === 0) ? 1 : (dia > 1 ? 8 - dia : 0);
  fecha.setDate(fecha.getDate() + diasParaLunes);
  return fecha;
}

function generarTurnos() {
  let hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (hoy.getDay() === 6 || hoy.getDay() === 0) {
    hoy = siguienteLunes(hoy);
  }

  const medicos = [1, 2, 3];
  const dias = 5;
  const intervalos = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];

  const turnos = [];
  let idContador = 1;

  for (let dia = 0; dia < dias; dia++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + dia);

    const diaSemana = fecha.getDay();
    if (diaSemana === 0 || diaSemana === 6) continue;

    const fechaStr = fecha.toISOString().slice(0, 10);

    for (const medico of medicos) {
      for (const hora of intervalos) {
        turnos.push({
          id: idContador++,
          medico: medico,
          fecha: fechaStr,
          hora: hora,
          disponible: true,
        });
      }
    }
  }

  return turnos;
}

// Generar el JSON
const turnosJSON = JSON.stringify(generarTurnos(), null, 2);

// Crear un blob y descargarlo
const blob = new Blob([turnosJSON], { type: "application/json" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "turnos.json";
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);

console.log("Archivo turnos.json generado y descargado!");
