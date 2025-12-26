/*
  Warnings:

  - You are about to drop the column `goal` on the `BodyInfo` table. All the data in the column will be lost.
  - You are about to drop the column `healthConditions` on the `BodyInfo` table. All the data in the column will be lost.
  - Added the required column `age` to the `BodyInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dietaryPreference` to the `BodyInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experienceLevel` to the `BodyInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `BodyInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motivation` to the `BodyInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredTime` to the `BodyInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryGoal` to the `BodyInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionDuration` to the `BodyInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetWeight` to the `BodyInfo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "PrimaryGoal" AS ENUM ('WEIGHT_LOSS', 'MUSCLE_GAIN', 'GENERAL_FITNESS', 'STRENGTH', 'ENDURANCE');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "WorkoutDays" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- CreateEnum
CREATE TYPE "PreferredTime" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- CreateEnum
CREATE TYPE "SessionDurations" AS ENUM ('MIN_30', 'MIN_45', 'MIN_60', 'MIN_90');

-- CreateEnum
CREATE TYPE "DietaryPreference" AS ENUM ('NO_RESTRICTIONS', 'VEGETARIAN', 'VEGAN', 'KETO', 'PALEO', 'MEDITERRANEAN');

-- AlterTable
ALTER TABLE "BodyInfo" DROP COLUMN "goal",
DROP COLUMN "healthConditions",
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "challenges" TEXT,
ADD COLUMN     "dietaryPreference" "DietaryPreference" NOT NULL,
ADD COLUMN     "experienceLevel" "ExperienceLevel" NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "injuries" TEXT,
ADD COLUMN     "medicalConditions" TEXT,
ADD COLUMN     "motivation" TEXT NOT NULL,
ADD COLUMN     "preferredTime" "PreferredTime" NOT NULL,
ADD COLUMN     "primaryGoal" "PrimaryGoal" NOT NULL,
ADD COLUMN     "sessionDuration" "SessionDurations" NOT NULL,
ADD COLUMN     "targetWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "workoutDays" "WorkoutDays"[];

-- DropEnum
DROP TYPE "public"."FitnessGoal";
