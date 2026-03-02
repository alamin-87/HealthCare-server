import status from "http-status";
import { userStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/appError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { TokenUtils } from "../../utils/token";
import type { IRequestUser } from "../../interfaces/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../config/env";
import type { JwtPayload } from "jsonwebtoken";

interface IRegisterPatient {
  name: string;
  email: string;
  password: string;
}
interface ILoginPatient {
  email: string;
  password: string;
}
const registerPatient = async (payload: IRegisterPatient) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      //   needPasswordChange: false,
      //   role: Role.PATIENT,
    },
  });
  if (!data.user) {
    // throw new Error("Failed to register patient");
    throw new AppError(status.BAD_REQUEST, "Failed to register patient");
  }
  try {
    const patient = await prisma.$transaction(async (tx) => {
      const createdPatient = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });
      return createdPatient;
    });
    const accessToken = TokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      isDeleted: data.user.isDeleted,
      status: data.user.status,
      emailVerified: data.user.emailVerified,
    });
    const refreshToken = TokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      isDeleted: data.user.isDeleted,
      status: data.user.status,
      emailVerified: data.user.emailVerified,
    });
    return {
      ...data,
      accessToken,
      refreshToken,
      patient,
    };
  } catch (error) {
    // If patient creation fails, delete the created user to maintain consistency
    console.log(error);
    await prisma.user.delete({
      where: { id: data.user.id },
    });
    throw error;
  }
};
const loginUser = async (payload: ILoginPatient) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  if (!data.user) {
    throw new Error("Failed to login patient");
  }
  if (data.user.status === userStatus.BLOCKED) {
    throw new Error("Your account is inactive. Please contact support.");
  }
  if (data.user.isDeleted || data.user.status === userStatus.DELETED) {
    throw new Error("Your account has been deleted. Please contact support.");
  }
  const accessToken = TokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    isDeleted: data.user.isDeleted,
    status: data.user.status,
    emailVerified: data.user.emailVerified,
  });
  const refreshToken = TokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    isDeleted: data.user.isDeleted,
    status: data.user.status,
    emailVerified: data.user.emailVerified,
  });
  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

const getMe = async (user: IRequestUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      patients: {
        include: {
          appointments: true,
          reviews: true,
          prescriptions: true,
          medicalReports: true,
          patientHealthData: true,
        },
      },
      doctor: {
        include: {
          specialties: true,
          appointments: true,
          reviews: true,
          prescriptions: true,
        },
      },
      admin: true,
    },
  });

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return isUserExists;
};
const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isSessionTokenExist = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });
  if (!isSessionTokenExist) {
    throw new AppError(status.UNAUTHORIZED, "Invalid Session Token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET,
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh Token");
  }
  const data = verifiedRefreshToken.data as JwtPayload;
  const NewAccessToken = TokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    email: data.email,
    name: data.name,
    isDeleted: data.isDeleted,
    status: data.status,
    emailVerified: data.emailVerified,
  });
  const NewRefreshToken = TokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    email: data.email,
    name: data.name,
    isDeleted: data.isDeleted,
    status: data.status,
    emailVerified: data.emailVerified,
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });
  return {
    accessToken: NewAccessToken,
    refreshToken: NewRefreshToken,
    sessionToken: token,
  };
};
export const AuthService = {
  registerPatient,
  loginUser,
  getMe,
  getNewToken,
};
