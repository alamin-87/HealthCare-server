import { userStatus, type Role } from "../../generated/prisma/enums";
import type { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/appError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        // session token verification
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      if (!sessionToken) {
        throw new Error("Unauthorized access! No Session Token Provided.");
      }
      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });
        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;
          const now = new Date();
          const expireAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);
          const sessionLifeTime = expireAt.getTime() - createdAt.getTime();
          const timeRemaining = expireAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;
          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expire-At", expireAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
            console.log("Session Expiring Soon!");
          }
          if (
            user.status === userStatus.BLOCKED ||
            user.status === userStatus.DELETED
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is not active",
            );
          }
          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is Deleted",
            );
          }
          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden Access! You do not have permission to access this resource",
            );
          }
        }
        // const accessToken = cookieUtils.getCookie(req, "accessToken");
        // if (!accessToken) {
        //   throw new AppError(
        //     status.UNAUTHORIZED,
        //     "Unauthorized access! No access token provided",
        //   );
        // }
      }
      // access token verification
      const accessToken = cookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No access token provided",
        );
      }
      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );
      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! Invalid access token",
        );
      }
      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role as Role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! You do not have permission to access  resource ",
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
