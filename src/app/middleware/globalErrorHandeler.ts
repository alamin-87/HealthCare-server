import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import * as z from "zod";
import type {
  TErrorResponse,
  TErrorSource,
} from "../interfaces/error.interface";
import { handelZodError } from "../errorHelpers/handelZodError";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";

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
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let errorources: TErrorSource[] = [];
  if (err instanceof z.ZodError) {
    const simplefiedError: TErrorResponse = handelZodError(err);
    statusCode = simplefiedError.statusCode as number;
    message = simplefiedError.message;
    errorources = [...simplefiedError.errorources];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = status.BAD_REQUEST;
    message = err.message;
    errorources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }
  const errorResponse: TErrorResponse = {
    success: false,
    message,
    errorources,
    error: envVars.NODE_ENV === "development" ? err : undefined,
  };
  res.status(statusCode).json(errorResponse);
};
