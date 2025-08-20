import { HttpError } from "../errors/HttpError";
import { IAddLeadToCampaignParams, ICampaignsRepository, ICreateCampaignParams } from "../repositories/CampaignsRepository";
import { ILeadsRepository, ILeadWhereParams, LeadCampaignStatus } from "../repositories/LeadsRepository";

export interface IGetCampaignLeadsWithPaginationParams
{
  page?: number
  pageSize?: number
  name?: string
  status?: LeadCampaignStatus
  sortBy?: "name" | "status" | "createdAt"
  orderBy?: "asc" | "desc"
}

export class CampaignsService
{
  constructor(
    private readonly campaignsRepository: ICampaignsRepository,
    private readonly leadsRepository: ILeadsRepository
  ) { }

  async getAllCampaigns()
  {
    return await this.campaignsRepository.find()
  }

  async getCampaignById(id: number)
  {
    const campaign = await this.campaignsRepository.findById(id)
    if (!campaign) throw new HttpError(404, "Campaign Not Found!")
    
    return campaign
  }

  async createCampaign(params: ICreateCampaignParams)
  {
    const newCampaign = await this.campaignsRepository.create(params)
    return newCampaign
  }

  async updateCampaign(campaignId: number, params: Partial<ICreateCampaignParams>)
  {
    const updatedCampaign = await this.campaignsRepository.updateById(campaignId, params)
    if (!updatedCampaign) throw new HttpError(404, "Campaign Not Found!")
  
    return updatedCampaign
  }

  async deleteCampaign(campaignId: number)
  {
    const deletedCampaign = await this.campaignsRepository.deleteById(campaignId)
    if (!deletedCampaign) throw new HttpError(404, "Campaign Not Found!")
  
    return deletedCampaign
  }
  
  async getAllCampaignLeadsPaginated(campaignId: number, params: IGetCampaignLeadsWithPaginationParams)
  {
    const { page = 1, pageSize = 10, name, status, sortBy, orderBy } = params
    
    const limit = pageSize
    const offset = (page - 1) * limit
    const where: ILeadWhereParams = { campaignId, campaignStatus: status }

    if (name) where.name = { like: name, mode: "insensitive" }

    const leads = await this.leadsRepository.find({
      where, sortBy, orderBy, limit, offset, include: { campaigns: true }
    })
    const total = await this.leadsRepository.count(where)

    return {
      data: leads,
      meta: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async addCampaignLead(params: IAddLeadToCampaignParams)
  {
    const updatedCampaign = await this.campaignsRepository.addLead(params)
    return updatedCampaign
  }

  async updateCampaignLead(params: IAddLeadToCampaignParams)
  {
    const updatedCampaign = await this.campaignsRepository.updateLeadStatus(params)
    return updatedCampaign
  }

  async removeCampaignLead(campaignId: number, leadId: number)
  {
    const updatedCampaign = await this.campaignsRepository.removeLead(campaignId, leadId)
    return updatedCampaign
  }
}