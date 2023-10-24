export function containsFile(obj: Record<string, unknown>) {
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (obj[key] instanceof File) {
        return true;
      }
    }
  }
  return false;
}
