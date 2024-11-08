export function validarRuc(ruc: string): boolean {
  const dc = parseInt(ruc.substr(11, 1));
    const rutWithoutDc = ruc.substr(0, 11);
    let total = 0;
    let factor = 2;

    for (let i = 10; i >= 0; i--) {
      total += factor * parseInt(rutWithoutDc.substr(i, 1));
      factor = factor === 9 ? 2 : factor + 1;
    }

    let dv = 11 - (total % 11);

    if (dv === 11) {
      dv = 0;
    } else if (dv === 10) {
      dv = 1;
    }

    if (dv === dc)
      return true;
    else
      return false;
}
