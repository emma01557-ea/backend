// utils/timeHelpers.js (opcional, para reusar)
function esHorarioPermitido(turno) {
  const ahora = new Date();
  const hora = ahora.getHours();
  const minutos = ahora.getMinutes();

  if (turno === 'almuerzo') {
    return (hora > 6 || (hora === 6 && minutos >= 0)) && (hora < 11 || (hora === 11 && minutos <= 30));
  }

  if (turno === 'cena') {
    return (hora > 15 || (hora === 15 && minutos >= 0)) && (hora < 18 || (hora === 18 && minutos <= 30));
  }

  return false;
}
module.exports = esHorarioPermitido;
