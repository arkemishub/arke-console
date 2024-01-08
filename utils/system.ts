export function isMultiProjectConsole() {
  return process.env.NEXT_MULTIPROJECT === "true";
}
