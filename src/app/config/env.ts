import dotenv from "dotenv";
import status from "http-status";
import AppError from "../errorHelpers/appError";
dotenv.config();
interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  NODE_ENV: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  BETTER_AUTH_SESSION_TOKEN_EXPIRE: string;
  BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
}

const envConfig = (): EnvConfig => {
  const requiredVars = [
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "NODE_ENV",
    "ACCESS_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_SECRET",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRE",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
  ];
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      // throw new Error(
      //   `Environment variable ${varName} is required but not set.`,
      // );
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
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
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    BETTER_AUTH_SESSION_TOKEN_EXPIRE:process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRE as string,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE:process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string
  };
};
export const envVars = envConfig();
