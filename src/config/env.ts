import dotenv from "dotenv";
dotenv.config();
interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  NODE_ENV: string;
}

const envConfig = (): EnvConfig => {
  const requiredVars = [
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "NODE_ENV",
  ];
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(
        `Environment variable ${varName} is required but not set.`,
      );
    }
  });
  return {
    PORT: process.env.PORT || "5000",
    DATABASE_URL: process.env.DATABASE_URL || "",
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
    NODE_ENV: process.env.NODE_ENV || "development",
  };
};
export const envVars = envConfig();
