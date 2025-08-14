import { Campaign, LeadCampaign } from "@prisma/client";
import { IAddLeadToCampaignParams, ICampaignsRepository, ICreateCampaignParams } from "../CampaignsRepository";
import { prisma } from "../../database";

export class PrismaCampaignsRepository implements ICampaignsRepository
{
  async find(): Promise<Campaign[]>
  {
    return prisma.campaign.findMany()
  }

  async findById(id: number): Promise<Campaign | null>
  {
    return prisma.campaign.findUnique({
      where: { id },
      include: {
        leads: {
          include: {
            lead: true
          }
        }
      }
    })
  }

  async create(params: ICreateCampaignParams): Promise<Campaign>
  {
    return prisma.campaign.create({ data: params })
  }

  async updateById(id: number, params: Partial<ICreateCampaignParams>): Promise<Campaign | null>
  {
    const campaignExists = await prisma.campaign.findUnique({ where: { id } })
    if (!campaignExists) return null

    return prisma.campaign.update({
      where: { id },
      data: params
    })
  }

  async deleteById(id: number): Promise<Campaign | null>
  {
    const campaignExists = await prisma.campaign.findUnique({ where: { id } })
    if (!campaignExists) return null

    return prisma.campaign.delete({ where: { id }})
  }

  async addLead(params: IAddLeadToCampaignParams): Promise<void>
  {
    //leadId_campaignId = [leadId, campaignId]
    await prisma.leadCampaign.create({ data: params })
  }

  async updateLeadStatus(params: IAddLeadToCampaignParams): Promise<void>
  {
    const { campaignId, leadId, status } = params
    await prisma.leadCampaign.update({
      data: { status },
      where: {
        leadId_campaignId: {
          campaignId: campaignId,
          leadId: leadId
        }
      }
    })
  }

  async removeLead(campaignId: number, leadId: number): Promise<void>
  {
    await prisma.leadCampaign.delete({
      where: {
        leadId_campaignId: { campaignId, leadId }
      }
    })
  }
}