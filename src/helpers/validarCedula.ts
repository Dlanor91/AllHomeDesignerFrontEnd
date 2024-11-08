export function validationDigit(ci: string): number {
  let a = 0;
  let i = 0;
  if (ci.length <= 6) {
    for (i = ci.length; i < 7; i++) {
      ci = '0' + ci;
    }
  }
  for (i = 0; i < 7; i++) {
    a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
  }
  if (a % 10 === 0) {
    return 0;
  } else {
    return 10 - a % 10;
  }
}

export function validateCI(ci: string): boolean {
  ci = cleanCI(ci);
  const dig = ci[ci.length - 1];
  ci = ci.replace(/[0-9]$/, '');
  return dig === validationDigit(ci).toString();
}

export function cleanCI(ci: string): string {
  return ci.replace(/\D/g, '');
}





