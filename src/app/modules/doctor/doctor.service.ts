import { prisma } from "../../lib/prisma";
import type { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctord = async () => {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });
  return doctors;
};
const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });
  return doctor;
};
const updateDoctor = async (
  id: string,
  payload: IUpdateDoctorPayload
) => {
  return await prisma.$transaction(async (tx) => {
    const doctor = await tx.doctor.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or already deleted");
    }

    const updatedDoctor = await tx.doctor.update({
      where: { id },
      data: payload,
      include: {
        user: true,
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    return updatedDoctor;
  });
};
const deleteDoctor = async (id: string) => {
  return prisma.$transaction(async (tx) => {
    const doctor = await tx.doctor.findUniqueOrThrow({
      where: { id },
    });

    const deletedDoctor = await tx.doctor.update({
      where: { id },
      data: { isDeleted: true },
    });

    await tx.user.update({
      where: { id: doctor.userId },
      data: { status: "DELETED" },
    });

    return deletedDoctor;
  });
};

export const DoctorService = {
  getAllDoctord,
  getDoctorById,
  updateDoctor,
  deleteDoctor
};
