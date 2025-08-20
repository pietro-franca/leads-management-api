import { Handler } from "express";
import { AddLeadRequestSchema, GetCampaignLeadsRequestSchema, UpdateLeadStatusRequestSchema } from "./schemas/CampaignsRequestSchema";
import { CampaignsService } from "../services/CampaignsService";

export class CampaignLeadsController
{
  constructor(private readonly campaignsService: CampaignsService) { }

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

      const result = await this.campaignsService.getAllCampaignLeadsPaginated(
        campaignId, { name, status, page: +page, pageSize: +pageSize, sortBy, orderBy }
      )
      
      res.json(result)
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

      await this.campaignsService.addCampaignLead(params)

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
      const params = {campaignId, leadId, status}
      
      const updatedLeadCampaign = await this.campaignsService.updateCampaignLead(params)

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

      const removedLead = await this.campaignsService.removeCampaignLead(campaignId, leadId)

      res.json(removedLead)
    } 
    catch (error) 
    {
      next(error)
    }
  }
}