function AlertMessage({ mensaje, tipo = 'error' }) {
  if (!mensaje) {
    return null;
  }

  return (
    <div
      className={`alerta alerta-${tipo}`}
      role={tipo === 'error' ? 'alert' : 'status'}
    >
      {mensaje}
    </div>
  );
}

export default AlertMessage;
