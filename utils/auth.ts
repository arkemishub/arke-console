function getCookieName() {
  const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://");
  return `${secureCookie ? "__Secure-" : ""}arke-console-auth`;
}

export { getCookieName };
