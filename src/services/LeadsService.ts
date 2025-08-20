import { HttpError } from "../errors/HttpError"
import { ICreateLeadParams, ILeadsRepository, ILeadWhereParams, LeadStatus } from "../repositories/LeadsRepository"

export interface IGetLeadsWithPaginationParams
{
  page?: number
  pageSize?: number
  name?: string
  status?: LeadStatus
  sortBy?: "name" | "status" | "createdAt"
  orderBy?: "asc" | "desc"
}

export class LeadsService 
{
  constructor(private readonly leadsRepository: ILeadsRepository) {}
  
  async getAllLeadsPaginated(params: IGetLeadsWithPaginationParams)
  {
    const { page = 1, pageSize = 10, name, status, sortBy, orderBy } = params
    
    const limit = pageSize
    const offset = (page - 1) * limit
    const where: ILeadWhereParams = {}

    if (name) where.name = { like: name, mode: "insensitive" }
    if (status) where.status = status

    const leads = await this.leadsRepository.find({ where, sortBy, orderBy, limit, offset })
    const total = await this.leadsRepository.count(where)
  
    return {
      leads,
      meta: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getLeadById(id: number)
  {
    const lead = await this.leadsRepository.findById(Number(id))
    if (!lead) throw new HttpError(404, "Lead Not Found!")
    return lead
  }

  async createLead(params: ICreateLeadParams)
  {
    if (!params.status) params.status = "New"
    const newLead = await this.leadsRepository.create(params)
    return newLead
  }

  async updateLead(leadId: number, params: Partial<ICreateLeadParams>)
  {
    const lead = await this.leadsRepository.findById(leadId)
    if (!lead) throw new HttpError(404, "Lead Not Found!")

    if (lead.status === "New" && params.status && params.status !== "Contacted")
      throw new HttpError(400, "A new leader must be contacted before their status is updated to other values")

    if (params.status && params.status === "Archived")
    {
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - lead.updatedAt.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 180) 
        throw new HttpError(400, "A lead can only be archived after 6 months of inactivity")
    }

    const updatedLead = await this.leadsRepository.updateById(leadId, params)

    return updatedLead
  }

  async deleteLead(leadId: number)
  {
    const leadExists = await this.leadsRepository.findById(leadId)
    if (!leadExists) throw new HttpError(404, "Lead Not Found!")
      
    const deletedLead = await this.leadsRepository.deleteById(leadId)

    return deletedLead
  }
}