import type { Gender } from "../../../generated/prisma/enums";

/*
model Doctor {
    id String @id @default(uuid(7))

    name          String   @db.VarChar(100)
    email         String   @unique @db.VarChar(255)
    profilePhoto  String?  @db.VarChar(255)
    contactNumber String?  @db.VarChar(20)
    address       String?  @db.Text
    createdAt     DateTime @default(now())
    updatedAt     DateTime @updatedAt

    registrationNumber  String    @unique
    experienceYears     Int       @default(0)
    gender              Gender
    appointmentFee      Float
    qualification       String
    currentWorkingPlace String
    designation         String
    averageRating       Float     @default(0.0)
    isDeleted           Boolean   @default(false)
    deletedAt           DateTime?
    userId              String    @unique
    user                User      @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
    specialties DoctorSpecialty[]

    @@index([isDeleted], name: "idx_doctor_isDeleted")
    @@index([email], name: "idx_doctor_email")
    @@map("doctor")
}



*/
export interface ICreateDoctorPayload {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePhoto: string;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    experienceYears: number;
    gender: Gender;
    appointmentFee: number;
    currentWorkingPlace: string;
    designation: string;
    qualification: string;
  };
  specialties: string[];
}
