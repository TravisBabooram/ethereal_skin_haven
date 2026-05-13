export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export function validatePhone(phone: string): boolean {
  return /^\d{10,}$/.test(phone.replace(/\D/g, ""));
}

export function sanitizeString(str: string): string {
  return str.trim().substring(0, 500);
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
