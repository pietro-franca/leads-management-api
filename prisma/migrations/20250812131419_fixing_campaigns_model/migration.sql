/*
  Warnings:

  - The values [NewEngaged] on the enum `LeadCampaignStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."LeadCampaignStatus_new" AS ENUM ('New', 'Engaged', 'FollowUp_Scheduled', 'Contacted', 'Qualified', 'Converted', 'Unresponsive', 'Disqualified', 'Re_Engaged', 'Opted_Out');
ALTER TABLE "public"."LeadCampaign" ALTER COLUMN "status" TYPE "public"."LeadCampaignStatus_new" USING ("status"::text::"public"."LeadCampaignStatus_new");
ALTER TYPE "public"."LeadCampaignStatus" RENAME TO "LeadCampaignStatus_old";
ALTER TYPE "public"."LeadCampaignStatus_new" RENAME TO "LeadCampaignStatus";
DROP TYPE "public"."LeadCampaignStatus_old";
COMMIT;
