// CPF/CNPJ validation + formatting (mirrors backend rlm.py)

const onlyDigits = (v) => (v || '').replace(/\D/g, '');

export function validateCPF(cpf) {
  const c = onlyDigits(cpf);
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  const dv = (part, factor) => {
    let s = 0;
    for (let i = 0; i < part.length; i++) s += parseInt(part[i], 10) * (factor - i);
    const r = (s * 10) % 11;
    return r === 10 ? 0 : r;
  };
  if (dv(c.slice(0, 9), 10) !== parseInt(c[9], 10)) return false;
  return dv(c.slice(0, 10), 11) === parseInt(c[10], 10);
}

export function validateCNPJ(cnpj) {
  const c = onlyDigits(cnpj);
  if (c.length !== 14 || /^(\d)\1{13}$/.test(c)) return false;
  const dv = (part, weights) => {
    let s = 0;
    for (let i = 0; i < part.length; i++) s += parseInt(part[i], 10) * weights[i];
    const r = s % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  if (dv(c.slice(0, 12), w1) !== parseInt(c[12], 10)) return false;
  const w2 = [6, ...w1];
  return dv(c.slice(0, 13), w2) === parseInt(c[13], 10);
}

// returns { valid, type } ; empty string -> {valid:true(empty allowed), type:null}
export function validateDoc(value) {
  const c = onlyDigits(value);
  if (c.length === 0) return { valid: true, type: null, empty: true };
  if (c.length === 11) return { valid: validateCPF(c), type: 'CPF', empty: false };
  if (c.length === 14) return { valid: validateCNPJ(c), type: 'CNPJ', empty: false };
  return { valid: false, type: null, empty: false };
}

export function formatCpfCnpj(value) {
  const c = onlyDigits(value).slice(0, 14);
  if (c.length <= 11) {
    return c
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return c
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}
