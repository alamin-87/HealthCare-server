import type { Response} from "express";
interface IApiResponse<T> {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data?: T;
}
export const sendResponse = <T>(res: Response, response: IApiResponse<T>) => {
  const { httpStatusCode, success, message, data } = response;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
  });
}; 