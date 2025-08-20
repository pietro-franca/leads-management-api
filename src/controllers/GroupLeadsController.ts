import { Handler } from "express";
import { GetLeadsRequestsSchema } from "./schemas/LeadsRequestSchema";
import { AddGroupLeadRequestSchema } from "./schemas/GroupsRequestSchema";
import { GroupsService } from "../services/GroupsService";

export class GroupLeadsController
{
  constructor(private readonly groupsService: GroupsService) { }

  getLeads: Handler = async (req, res, next) => {
    try 
    {
      const groupId = Number(req.params.groupId)
      const query = GetLeadsRequestsSchema.parse(req.query)
      const {
        page = "1",
        pageSize = "10",
        name,
        status,
        sortBy = "name",
        orderBy = "asc"
      } = query
      
      const result = await this.groupsService.getAllGroupLeadsPaginated(
        groupId, { name, status, page: +page, pageSize: +pageSize, sortBy, orderBy } 
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
      const groupId = Number(req.params.groupId)
      const { leadId } = AddGroupLeadRequestSchema.parse(req.body)
      const updatedGroup = await this.groupsService.addGroupLead(groupId, leadId)
      res.status(201).json(updatedGroup)
    } 
    catch (error) 
    {
      next(error)
    }
  }

  removeLead: Handler = async (req, res, next) => {
    try 
    {
      const groupId = Number(req.params.groupId)
      const leadId = Number(req.params.leadId)
      const updatedGroup = await this.groupsService.removeGroupLead(groupId, leadId)
      res.json(updatedGroup)
    } 
    catch (error) 
    {
      next(error)
    }
  }
}