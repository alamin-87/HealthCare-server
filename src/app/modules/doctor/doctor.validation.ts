import { z } from "zod";

export const updateDoctorZodSchema = z.object({
  name: z.string("Name is required"),
  profilePhoto: z.string("Profile photo is required"),
  contactNumbar: z.string("Contact number is required"),
  address: z.string("Address is required"),
  experience: z.number("Experience is required"),
}).partial();   