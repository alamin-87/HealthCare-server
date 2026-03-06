import type { Response } from "express";
interface IApiResponse<T> {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export const sendResponse = <T>(res: Response, response: IApiResponse<T>) => {
  const { httpStatusCode, success, message, data, meta } = response;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta,
  });
};
