import { Handler } from "express";
import { AddLeadRequestSchema, GetCampaignLeadsRequestSchema, UpdateLeadStatusRequestSchema } from "./schemas/CampaignsRequestSchema";
import { ILeadsRepository, ILeadWhereParams } from "../repositories/LeadsRepository";
import { ICampaignsRepository } from "../repositories/CampaignsRepository";

export class CampaignLeadsController
{
  constructor(
    private readonly campaignsRepository: ICampaignsRepository,
    private readonly leadsRepository: ILeadsRepository
  ) { }

  getLeads: Handler = async (req, res, next) => {
    try 
    {
      const campaignId = Number(req.params.campaignId)
      const query = GetCampaignLeadsRequestSchema.parse(req.query)
      const { 
        page = "1", 
        pageSize = "10", 
        name, 
        status, 
        sortBy = "name", 
        orderBy = "asc" 
      } = query

      const limit = Number(pageSize)
      const offset = (Number(page) - 1) * limit
      const where: ILeadWhereParams = { campaignId, campaignStatus: status }

      if (name) where.name = { like: name, mode: "insensitive" }

      const leads = await this.leadsRepository.find({
        where,
        sortBy,
        orderBy,
        limit,
        offset,
        include: { campaigns: true }
      })

      const total = await this.leadsRepository.count(where)

      res.json({
        leads,
        meta: {
          page: Number(page),
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    } 
    catch (error) 
    {
      next(error)
    }
  }

  addLead: Handler = async (req, res, next) => {
    try 
    {
      const campaignId = Number(req.params.campaignId)
      const { leadId, status = "New" } = AddLeadRequestSchema.parse(req.body)
      const params = {campaignId, leadId, status}

      await this.campaignsRepository.addLead(params)

      res.status(201).end()
    } 
    catch (error) 
    {
      next(error)
    }
  }

  updateLeadStatus: Handler = async (req, res, next) => {
    try 
    {
      const campaignId = Number(req.params.campaignId)
      const leadId = Number(req.params.leadId)
      const { status } = UpdateLeadStatusRequestSchema.parse(req.body)
      
      const updatedLeadCampaign = await this.campaignsRepository.updateLeadStatus({
        campaignId, leadId, status
      })

      res.json(updatedLeadCampaign)
    } 
    catch (error) 
    {
      next(error)
    }
  }

  removeLead: Handler = async (req, res, next) => {
    try 
    {
      const campaignId = Number(req.params.campaignId)
      const leadId = Number(req.params.leadId)

      const removedLead = await this.campaignsRepository.removeLead(campaignId, leadId)

      res.json(removedLead)
    } 
    catch (error) 
    {
      next(error)
    }
  }
}