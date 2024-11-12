export function validateAppName(value) {
  const regex = /^[A-Za-z0-9-]+$/;
  return regex.test(value);
}
