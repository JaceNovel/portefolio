export function isHoneypotTripped(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}
