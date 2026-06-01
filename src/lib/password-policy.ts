export const PASSWORD_REQUIREMENTS =
  "Le mot de passe doit contenir au moins 8 caracteres, une majuscule, une minuscule, un chiffre et un caractere special.";

export function validatePasswordStrength(password: string) {
  if (password.length < 8 || password.length > 128) {
    return PASSWORD_REQUIREMENTS;
  }

  if (!/[a-z]/.test(password)) {
    return PASSWORD_REQUIREMENTS;
  }

  if (!/[A-Z]/.test(password)) {
    return PASSWORD_REQUIREMENTS;
  }

  if (!/\d/.test(password)) {
    return PASSWORD_REQUIREMENTS;
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return PASSWORD_REQUIREMENTS;
  }

  return null;
}
