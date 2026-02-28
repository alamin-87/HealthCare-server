import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../config/env";
import { cookieUtils } from "./cookie";
import type { Response } from "express";
import ms, { type StringValue } from "ms";
const getAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    {
      expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN,
    } as SignOptions,
  );
  return accessToken;
};
const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    {
      expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN,
    } as SignOptions,
  );
  return refreshToken;
};
const setAccessTokenCookie = (res: Response, token: string) => {
  const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue);
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: Number(maxAge),
  });
};
const setRefreshTokenCookie = (res: Response, token: string) => {
  const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue);
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: Number(maxAge),
  });
};
const setBetterAuthSessionCookie = (res: Response, token: string) => {
  const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue);
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: Number(maxAge),
  });
};
export const TokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
};
