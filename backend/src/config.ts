export const config = {
  JWT_SECRET: requireEnv("JWT_SECRET"),
  DATABASE_URL: requireEnv("DATABASE_URL"),
  BASE_URL: requireEnv("BASE_URL"),
  REDIS_HOST: requireEnv("REDIS_HOST"),
  REDIS_PORT: requireEnv("REDIS_PORT"),
  OPENAI_API_KEY: requireEnv("OPENAI_API_KEY"),
  env: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV !== "production",
  logLevel: process.env.LOG_LEVEL || "info",
  baseUrl: process.env.BASE_URL || "http://localhost: 3001",
  jwtTokenSaltRounds: 10,
};

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}
