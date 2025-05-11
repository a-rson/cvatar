export const config = {
  env: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV !== "production",
  logLevel: process.env.LOG_LEVEL || "info",
  baseUrl: process.env.BASE_URL || "http://localhost: 3001",
  jwtTokenSaltRounds: 10,
};
