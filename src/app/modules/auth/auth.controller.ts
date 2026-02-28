import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import type { Request, Response } from "express";
import { TokenUtils } from "../../utils/token";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const data = await AuthService.registerPatient(payload);
   const { accessToken, refreshToken, token, ...rest } = data;
  TokenUtils.setAccessTokenCookie(res, accessToken);
  TokenUtils.setRefreshTokenCookie(res, refreshToken);
  TokenUtils.setBetterAuthSessionCookie(res, token as string);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Patient registered successfully",
    data:{
       token,
      accessToken,
      refreshToken,
      ...rest,
    }
  });
});
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const data = await AuthService.loginUser(payload);
  const { accessToken, refreshToken, token, ...rest } = data;
  TokenUtils.setAccessTokenCookie(res, accessToken);
  TokenUtils.setRefreshTokenCookie(res, refreshToken);
  TokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Patient logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

export const AuthController = {
  registerPatient,
  loginUser,
};
