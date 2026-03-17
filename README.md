## HealthCare Server

Backend API for a HealthCare application.

- **Runtime**: Node.js
- **Framework**: Express (v5) + TypeScript
- **Database**: PostgreSQL + Prisma
- **Auth**: Better Auth + role-based guards (cookie-based)
- **Uploads**: Multer + Cloudinary
- **Email**: Nodemailer + EJS templates
- **Payments**: Stripe Checkout + webhook (`POST /webhook`)

## Table of contents

- [Features](#features)
- [Quick start (clone & run)](#quick-start-clone--run)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [API conventions](#api-conventions)
- [Endpoints](#endpoints)
- [API examples (curl)](#api-examples-curl)
- [Data model (Prisma)](#data-model-prisma)
- [Stripe webhook (local)](#stripe-webhook-local)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

- **Authentication**
  - Email/password sign-up + sign-in
  - Email verification + password reset via OTP (email)
  - Google OAuth login flow
  - Session + JWT cookies: `better-auth.session_token`, `accessToken`, `refreshToken`
- **Scheduling & booking**
  - Schedules (time windows)
  - Doctor schedules (availability slots; bookable / booked)
  - Appointments: book **Pay Now** (Stripe Checkout) or **Pay Later**
- **Patient profile**
  - Update profile with optional file uploads (profile photo + medical reports)
- **Operational**
  - Standard JSON response envelope (`sendResponse`)
  - Centralized error handler (Zod + Prisma + AppError)

## Quick start (clone & run)

### Prerequisites

- **Node.js** (recommended: latest LTS)
- **PostgreSQL** running locally or via cloud
- (Optional) **Stripe CLI** for local webhooks

### Clone

```bash
git clone < https://github.com/alamin-87/HealthCare-server >
cd HealthCare-server
```

### Install

```bash
npm install
```

### Configure `.env`

Create a `.env` file in the repo root. The server validates required vars on boot in `src/app/config/env.ts`.

### Run migrations

```bash
npm run migrate
```

### Start dev server

```bash
npm run dev
```

On startup (`src/server.ts`) the app also attempts to **seed a Super Admin** (only if it doesn’t exist yet).

## Environment variables

All variables listed here are required.

### Core

| Variable | Example | Notes |
|---|---|---|
| `PORT` | `5000` | API port |
| `NODE_ENV` | `development` | Enables debug info in error responses |
| `FRONTEND_URL` | `http://localhost:3000` | OAuth redirects + Stripe success/cancel URLs + CORS |
| `DATABASE_URL` | `postgresql://USER:PASSWORD@localhost:5432/healthcare?schema=public` | PostgreSQL connection string |

### Auth (Better Auth + JWT)

| Variable | Example |
|---|---|
| `BETTER_AUTH_URL` | `http://localhost:5000` |
| `BETTER_AUTH_SECRET` | `...` |
| `BETTER_AUTH_SESSION_TOKEN_EXPIRE` | `86400` |
| `BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE` | `86400` |
| `ACCESS_TOKEN_SECRET` | `...` |
| `ACCESS_TOKEN_EXPIRES_IN` | `1d` |
| `REFRESH_TOKEN_SECRET` | `...` |
| `REFRESH_TOKEN_EXPIRES_IN` | `30d` |

### Email (SMTP)

| Variable | Example | Notes |
|---|---|---|
| `EMAIL_SENDER_SMTP_HOST` | `smtp.gmail.com` |  |
| `EMAIL_SENDER_SMTP_PORT` | `465` | Mailer uses `secure: true` |
| `EMAIL_SENDER_SMTP_USER` | `...` |  |
| `EMAIL_SENDER_SMTP_PASS` | `...` |  |
| `EMAIL_SENDER_SMTP_FROM` | `PH HealthCare <no-reply@example.com>` |  |

### Google OAuth

| Variable | Example |
|---|---|
| `GOOGLE_CLIENT_ID` | `...` |
| `GOOGLE_CLIENT_SECRET` | `...` |
| `GOOGLE_CALLBACK_URL` | `http://localhost:5000/api/v1/auth/google/success` |

### Cloudinary

| Variable | Example |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | `...` |
| `CLOUDINARY_API_KEY` | `...` |
| `CLOUDINARY_API_SECRET` | `...` |

### Stripe

| Variable | Example |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |

### Seeded super admin

| Variable | Example |
|---|---|
| `SUPER_ADMIN_EMAIL` | `admin@example.com` |
| `SUPER_ADMIN_PASSWORD` | `strong_password_here` |

### Copy/paste `.env` template

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/healthcare?schema=public"

BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_SESSION_TOKEN_EXPIRE=86400
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE=86400

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d

EMAIL_SENDER_SMTP_USER=your_smtp_user
EMAIL_SENDER_SMTP_PASS=your_smtp_pass
EMAIL_SENDER_SMTP_HOST=smtp.gmail.com
EMAIL_SENDER_SMTP_PORT=465
EMAIL_SENDER_SMTP_FROM="PH HealthCare <no-reply@example.com>"

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/success

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=strong_password_here
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Start production build (`dist/server.js`) |
| `npm run lint` | ESLint on `src/` |
| `npm run migrate` | `prisma migrate dev` |
| `npm run stripe:webhook` | Stripe CLI listener → forwards to `POST /webhook` |

## Project structure

structure:

```text
HealthCare-server/
├─ prisma/
│  ├─ schema/
│  │  ├─ schema.prisma
│  │  ├─ enums.prisma
│  │  ├─ auth.prisma
│  │  ├─ admin.prisma
│  │  ├─ doctor.prisma
│  │  ├─ patient.prisma
│  │  ├─ patientHealthData.prisma
│  │  ├─ medicalReport.prisma
│  │  ├─ specialty.prisma
│  │  ├─ schedule.prisma
│  │  ├─ appointment.prisma
│  │  ├─ payment.prisma
│  │  ├─ review.prisma
│  │  └─ prescription.prisma
│  └─ migrations/
├─ src/
│  ├─ server.ts                      # bootstrap + seed super admin
│  ├─ app.ts                         # express setup + routing + webhook
│  └─ app/
│     ├─ config/                     # env, stripe, cloudinary, multer
│     ├─ errorHelpers/               # Zod/Prisma/AppError helpers
│     ├─ interfaces/                 # shared TS types
│     ├─ lib/                        # prisma client + better-auth setup
│     ├─ middleware/                 # auth guard, validation, error handler
│     ├─ modules/                    # domain modules
│     │  ├─ auth/
│     │  ├─ user/
│     │  ├─ admin/
│     │  ├─ doctor/
│     │  ├─ patient/
│     │  ├─ schedule/
│     │  ├─ doctorSchedule/
│     │  ├─ appointment/
│     │  ├─ Specialty/
│     │  ├─ payment/
│     │  ├─ review/                  # present, not mounted in router
│     │  └─ prescription/            # present, not mounted in router
│     ├─ routes/index.ts             # mounts `/api/v1/*`
│     ├─ shared/                     # catchAsync + sendResponse
│     ├─ templates/                  # EJS templates
│     └─ utils/                      # jwt/token/cookie/email/seed
└─ package.json
```

## API conventions

### Base URLs

- **Root**: `GET /` → `" Welcome to PH-Health Care"`
- **Versioned API**: `/api/v1/*`
- **Better Auth handler**: `/api/auth/*` (Better Auth runtime handler)
- **Stripe webhook**: `POST /webhook` (raw body + signature)

### Auth & cookies

Most protected routes require cookies:

- `better-auth.session_token`
- `accessToken`
- `refreshToken`

Browser clients must send credentials:

- fetch: `credentials: "include"`
- axios: `withCredentials: true`

### Success response envelope

All controllers use `sendResponse`, so successful responses follow:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error response envelope

Errors are normalized by the global error handler:

```json
{
  "success": false,
  "message": "string",
  "errorSources": [
    { "path": "field", "message": "error message" }
  ]
}
```

## Endpoints

### Auth (`/api/v1/auth`)

| Method | Endpoint | Auth | Body (summary) |
|---|---|---|---|
| POST | `/register` | Public | `{ name, email, password }` |
| POST | `/login` | Public | `{ email, password }` |
| GET | `/me` | PATIENT |  |
| POST | `/refresh-token` | Cookies | uses `refreshToken` + session cookie |
| POST | `/change-password` | ADMIN/DOCTOR/PATIENT/SUPER_ADMIN | `{ currentPassword, newPassword }` |
| POST | `/logout` | ADMIN/DOCTOR/PATIENT/SUPER_ADMIN |  |
| POST | `/verify-email` | Public | `{ email, otp }` |
| POST | `/forget-password` | Public | `{ email }` |
| POST | `/reset-password` | Public | `{ email, otp, newPassword }` |
| GET | `/login/google` | Public | query: `redirect=/path` |
| GET | `/google/success` | Public | OAuth callback + redirect |
| GET | `/oauth/error` | Public | OAuth error redirect |

### Users (`/api/v1/users`)

| Method | Endpoint | Auth | Body (validated) |
|---|---|---|---|
| POST | `/create-doctor` | Public | `{ password, doctor: {...}, specialties: string[] }` |

Doctor creation payload (from `createDoctorZodSchema`):

- `password`: string (5–20)
- `doctor.name`: string (5–20)
- `doctor.email`: email
- `doctor.contactNumber`: string (11–14)
- `doctor.gender`: `MALE` or `FEMALE`
- `doctor.registrationNumber`: string (5–20)
- `doctor.experience`: integer \(\ge 0\)
- `doctor.appointmentFee`: number \(\ge 0\)
- `doctor.qualification`: string (5–100)
- `doctor.currentWorkingPlace`: string (5–100)
- `doctor.designation`: string (5–100)
- `specialties`: array of UUIDs

### Doctors (`/api/v1/doctors`)

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/` | Public |
| GET | `/:id` | ADMIN/SUPER_ADMIN |
| PATCH | `/:id` | ADMIN/SUPER_ADMIN |
| DELETE | `/:id` | ADMIN/SUPER_ADMIN |

### Admin (`/api/v1/admin`)

| Method | Endpoint | Auth | Body (summary) |
|---|---|---|---|
| GET | `/` | ADMIN/SUPER_ADMIN |  |
| GET | `/:id` | ADMIN/SUPER_ADMIN |  |
| PATCH | `/:id` | SUPER_ADMIN | `{ admin: { name?, profilePhoto?, contactNumber? } }` |
| DELETE | `/:id` | SUPER_ADMIN |  |
| PATCH | `/change-user-status` | ADMIN/SUPER_ADMIN | status change payload (see service) |
| PATCH | `/change-user-role` | SUPER_ADMIN | role change payload (see service) |

### Schedules (`/api/v1/schedules`)

| Method | Endpoint | Auth | Body (validated) |
|---|---|---|---|
| POST | `/` | ADMIN/SUPER_ADMIN | `{ startDate, endDate, startTime, endTime }` |
| GET | `/` | ADMIN/SUPER_ADMIN/DOCTOR | query supported |
| GET | `/:id` | ADMIN/SUPER_ADMIN/DOCTOR |  |
| PATCH | `/:id` | ADMIN/SUPER_ADMIN | partial of create schema |
| DELETE | `/:id` | ADMIN/SUPER_ADMIN |  |

### Doctor schedules (`/api/v1/doctor-schedules`)

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/create-my-doctor-schedule` | DOCTOR |
| GET | `/my-doctor-schedules` | DOCTOR |
| GET | `/` | ADMIN/SUPER_ADMIN |
| GET | `/:doctorId/schedule/:scheduleId` | ADMIN/SUPER_ADMIN |
| PATCH | `/update-my-doctor-schedule` | DOCTOR |
| DELETE | `/delete-my-doctor-schedule/:id` | DOCTOR |

### Appointments (`/api/v1/appointment`)

| Method | Endpoint | Auth | Body (summary) |
|---|---|---|---|
| POST | `/book-appointment` | PATIENT | `{ doctorId, scheduleId }` |
| POST | `/book-appointment-with-pay-later` | PATIENT | `{ doctorId, scheduleId }` |
| POST | `/initiate-payment/:id` | PATIENT |  |
| GET | `/my-appointments` | PATIENT/DOCTOR |  |
| GET | `/my-single-appointment/:id` | PATIENT/DOCTOR |  |
| PATCH | `/change-appointment-status/:id` | PATIENT/DOCTOR/ADMIN/SUPER_ADMIN | `{ status }` |
| GET | `/all-appointments` | ADMIN/SUPER_ADMIN |  |

### Patients (`/api/v1/patients`)

| Method | Endpoint | Auth | Content-Type |
|---|---|---|---|
| PATCH | `/update-my-profile` | PATIENT | `multipart/form-data` |

Form fields follow `PatientValidation.updatePatientProfileZodSchema`, including:

- `patientInfo.name`, `patientInfo.contactNumber`, `patientInfo.address`
- `patientHealthData.gender`, `patientHealthData.dateOfBirth`, `patientHealthData.bloodGroup`, ...
- `medicalReports[]` management records

Uploads:

- `profilePhoto` (file, max 1)
- `medicalReports` (files, max 5)

### Specialty (`/api/v1/specialty`)

| Method | Endpoint | Auth | Content-Type |
|---|---|---|---|
| POST | `/` | ADMIN/SUPER_ADMIN/PATIENT | `multipart/form-data` |
| GET | `/` | ADMIN/SUPER_ADMIN/DOCTOR/PATIENT |  |
| PATCH | `/:id` | ADMIN/SUPER_ADMIN |  |
| DELETE | `/:id` | ADMIN/SUPER_ADMIN |  |

Upload field name for icon: `file`.

### Stats (`/api/v1/stats`)

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/` | SUPER_ADMIN/ADMIN/DOCTOR/PATIENT |

### Review + Prescription modules (not mounted)

`review` and `prescription` route files exist, but they are **not mounted** in `src/app/routes/index.ts`. If you need them live, add them to the router.

## API examples (curl)

Assume:

```bash
export API="http://localhost:5000"
```

### Register patient

```bash
curl -i "$API/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Patient",
    "email": "jane@example.com",
    "password": "passw0rd"
  }'
```

### Login (cookie-based)

```bash
curl -i -c cookies.txt "$API/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "passw0rd"
  }'
```

### Get current user

```bash
curl -i -b cookies.txt "$API/api/v1/auth/me"
```

### Create doctor (example)

```bash
curl -i "$API/api/v1/users/create-doctor" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "doctor123",
    "doctor": {
      "name": "Dr. John Doe",
      "email": "dr.john@example.com",
      "contactNumber": "01700000000",
      "gender": "MALE",
      "address": "Dhaka, Bangladesh",
      "registrationNumber": "REG-12345",
      "experience": 5,
      "appointmentFee": 500,
      "qualification": "MBBS, FCPS",
      "currentWorkingPlace": "City Hospital",
      "designation": "Consultant"
    },
    "specialties": ["SPECIALTY_UUID_1"]
  }'
```

### Create schedule (ADMIN/SUPER_ADMIN)

```bash
curl -i -b cookies.txt "$API/api/v1/schedules" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2026-03-20",
    "endDate": "2026-03-20",
    "startTime": "10:00",
    "endTime": "12:00"
  }'
```

### Book appointment (Pay Now)

```bash
curl -i -b cookies.txt "$API/api/v1/appointment/book-appointment" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "DOCTOR_UUID",
    "scheduleId": "SCHEDULE_UUID"
  }'
```

### Update patient profile (multipart, PowerShell)

```powershell
$api="http://localhost:5000"
curl -i -b cookies.txt "$api/api/v1/patients/update-my-profile" `
  -F "profilePhoto=@C:\\path\\to\\photo.jpg" `
  -F "patientInfo[name]=Jane Updated" `
  -F "patientHealthData[gender]=FEMALE" `
  -F "patientHealthData[bloodGroup]=O_POSITIVE"
```

### Create specialty (multipart)

```bash
curl -i -b cookies.txt "$API/api/v1/specialty" \
  -F "file=@/path/to/icon.png" \
  -F "title=Cardiology" \
  -F "description=Heart and cardiovascular care"
```

## Data model (Prisma)

Simplified overview from `prisma/schema/*.prisma` (not every field shown).

### Core identity models

| Model | Important fields | Relations |
|---|---|---|
| `User` | `id`, `name`, `email`, `role`, `status`, `emailVerified` | `patients?`, `doctor?`, `admin?`, `sessions[]` |
| `Admin` | `id`, `name`, `email`, `userId` | `user` |
| `Doctor` | `id`, `name`, `email`, `registrationNumber`, `appointmentFee`, `userId` | `user`, `specialties[]`, `doctorSchedules[]` |
| `Patient` | `id`, `name`, `email`, `userId` | `user`, `patientHealthData?`, `medicalReports[]` |

### Scheduling & booking

| Model | Important fields | Notes |
|---|---|---|
| `Schedule` | `id`, `startDateTime`, `endDateTime` | base time windows |
| `DoctorSchedules` | `(doctorId, scheduleId)`, `isBooked` | composite primary key |
| `Appointment` | `id`, `videoCallingId`, `status`, `paymentStatus`, `doctorId`, `patientId`, `scheduleId` | 1:1 optional `payment`, `review`, `prescription` |

### Payments & documents

| Model | Important fields | Notes |
|---|---|---|
| `Payment` | `id`, `amount`, `transactionId`, `stripeEventId?`, `status`, `invoiceUrl?` | 1:1 with appointment |
| `MedicalReport` | `id`, `reportName`, `reportLink`, `patientId` | uploaded documents |
| `PatientHealthData` | `gender`, `dateOfBirth`, `bloodGroup`, `height`, `weight`, ... | 1:1 with patient |

### Lookups

| Model | Important fields |
|---|---|
| `Specialty` | `id`, `title`, `icon?` |
| `DoctorSpecialty` | `doctorId`, `specialtyId` |

### Enums

- `Role`: `SUPER_ADMIN | USER | ADMIN | DOCTOR | PATIENT`
- `userStatus`: `ACTIVE | BLOCKED | DELETED`
- `AppointmentStatus`: `SCHEDULED | INPROGRESS | COMPLETED | CANCELED`
- `PaymentStatus`: `PAID | UNPAID`
- `Gender`: `MALE | FEMALE | OTHER`
- `BloodGroup`: `A_POSITIVE | A_NEGATIVE | B_POSITIVE | ... | O_NEGATIVE`

## Stripe webhook (local)

Endpoint:

- `POST /webhook`

Local forwarding:

```bash
npm run stripe:webhook
```

Copy the signing secret printed by Stripe CLI into `STRIPE_WEBHOOK_SECRET`.

## Troubleshooting

- **Missing `.env`**: app throws on startup because required env vars are validated in `src/app/config/env.ts`.
- **SMTP issues**: mail config uses `secure: true` in `src/app/utils/email.ts` → usually needs SSL port `465` (or change code if your provider requires STARTTLS on `587`).
- **Cookies not set / not sent**: most auth is cookie-based. Use `-i` to inspect `Set-Cookie` and ensure your client sends credentials.
- **Modules not accessible**: `review` and `prescription` route modules are not mounted in `src/app/routes/index.ts`.


