import { userStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
// import { prisma } from "../../lib/prisma";

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
  //   const patient = await prisma.$transaction(async (tx) => {
  //  await tx.patient.create({
  //       data: {
  //         name: data.user.name,
  //         email: data.user.email,
  //         authId: data.user.id,
  //       },
  //     });
  //   });
  //   return patient;
  return data;
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
  if(data.user.isDeleted || data.user.status === userStatus.DELETED){
    throw new Error("Your account has been deleted. Please contact support.");
  }
  return data;
};

export const AuthService = {
  registerPatient,
  loginUser,
};
