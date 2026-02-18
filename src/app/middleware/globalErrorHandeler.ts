import type { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Error from global error handler:", err);
  }
  const statusCode: number = status.INTERNAL_SERVER_ERROR;
  const message: string = "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    error: err,
  });
};
