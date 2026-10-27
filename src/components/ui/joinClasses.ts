export function joinClasses(...parts: Array<string | undefined>): string {
  return parts.filter((part) => part !== undefined && part !== '').join(' ')
}
