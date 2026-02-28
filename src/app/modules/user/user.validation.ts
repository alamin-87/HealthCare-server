import { z } from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
  password: z.string().min(5).max(20),
  doctor: z.object({
    name: z.string("Name is requird").min(5).max(20),
    email: z.email("Invalid Email Address"),
    contactNumber: z.string("Contact Number is frequird").min(11).max(14),
    gender: z.enum(
      [Gender.MALE, Gender.FEMALE],
      "Gender must be MALE or FEMALE",
    ),
    address: z
      .string("Address is requird")
      .min(10, "Address is too short")
      .max(100, "Address is too long")
      .optional(),
    registrationNumber: z
      .string("Registration Number is requird")
      .min(5)
      .max(20),
    experienceYears: z.int().nonnegative(),
    appointmentFee: z.number().nonnegative(),
    qualification: z.string("Qualification is requird").min(5).max(100),
    currentWorkingPlace: z
      .string("Current Working Place is requird")
      .min(5)
      .max(100),
    designation: z.string("Designation is requird").min(5).max(100),
  }),
  specialties: z.array(z.uuid().min(1)),
});