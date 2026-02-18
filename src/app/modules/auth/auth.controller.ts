import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import type { Request, Response } from "express";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const data = await AuthService.registerPatient({ name, email, password });
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Patient registered successfully",
    data,
  });
});
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await AuthService.loginUser({ email, password });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Patient logged in successfully",
    data,
  });
});

export const AuthController = {
  registerPatient,
  loginUser,
};
