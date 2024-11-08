export function validarEmail(email: string): boolean {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

export function validarNombresDescripciones(nombre: string): boolean {
  const contieneNumeros = /\d/.test(nombre);
  const cantidadCaracteres = nombre.length >= 3;
  return !contieneNumeros && cantidadCaracteres;
}

export function validarUsuario(usuario: string): boolean {
  const cantidadCaracteres = usuario.length >= 4;
  return cantidadCaracteres;
}

export function validarPassword(password: string): boolean {
  const passwordPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}/;
  return passwordPattern.test(password);
}
