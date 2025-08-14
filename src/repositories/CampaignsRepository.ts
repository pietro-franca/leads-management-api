import { Campaign } from "@prisma/client"
import { LeadCampaignStatus } from "./LeadsRepository"

export interface ICreateCampaignParams
{
  name: string
  description: string
  startDate: Date
  endDate?: Date
}

export interface IAddLeadToCampaignParams
{
  campaignId: number
  leadId: number
  status: LeadCampaignStatus
}

export interface ICampaignsRepository
{
  find: () => Promise<Campaign[]>
  findById: (id: number) => Promise<Campaign | null>
  create: (params: ICreateCampaignParams) => Promise<Campaign>
  updateById: (id: number, params: Partial<ICreateCampaignParams>) => Promise<Campaign | null>
  deleteById: (id: number) => Promise<Campaign | null>
  addLead: (params: IAddLeadToCampaignParams) => Promise<void>
  updateLeadStatus: (params: IAddLeadToCampaignParams) => Promise<void>
  removeLead: (campaignId: number, leadId: number) => Promise<void>
}