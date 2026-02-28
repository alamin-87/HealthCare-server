import status from "http-status";
import * as z from "zod";
import type { TErrorResponse, TErrorSource } from "../interfaces/error.interface";

export const handelZodError = (err: z.ZodError):TErrorResponse => {
    const statusCode = status.BAD_REQUEST;
    const message = "Validation Error";
    const errorources: TErrorSource[] = [];     
    err.issues.forEach((issue) => {
      errorources.push({
        message: issue.message,
        path: issue.path.join(" "),
      });
    });
    return {
        success: false,
        message,
        errorources,
        statusCode,
        error: err,
    };  
}       