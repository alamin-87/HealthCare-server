import { userStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

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
    throw new Error("Failed to register patient");
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
    return {
      ...data,
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
  return data;
};

export const AuthService = {
  registerPatient,
  loginUser,
};
