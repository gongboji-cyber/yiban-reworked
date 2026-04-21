export function getAdminEmailList() {
  return String(process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email = '') {
  if (!email) return false;
  return getAdminEmailList().includes(String(email).trim().toLowerCase());
}
