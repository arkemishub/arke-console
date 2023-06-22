export function cleanId(value: string, callback?: () => void) {
  const regex = /[!@^&\/\\#,+()$~%.'":*?<>{}]/g;
  const cleanedValue = value
    // Clean whitespace
    .replace(/\s/g, "")
    // Clean strange characters with underscore
    .replace(regex, "_")
    .toLowerCase();
  if (!callback) {
    return cleanedValue;
  }
  if (value.search(regex) >= 0) {
    callback?.();
  }
  return cleanedValue;
}
