import { Handler } from "express";
import { GetLeadsRequestsSchema } from "./schemas/LeadsRequestSchema";
import { prisma } from "../database";
import { AddGroupLeadRequestSchema } from "./schemas/GroupsRequestSchema";
import { IGroupsRepository } from "../repositories/GroupsRepository";
import { ILeadsRepository, ILeadWhereParams } from "../repositories/LeadsRepository";

export class GroupLeadsController
{
  constructor(
    private readonly groupsRepository: IGroupsRepository,
    private readonly leadsRepository: ILeadsRepository
  ) { }

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
      
      const limit = Number(pageSize)
      const offset = (Number(page) - 1) * limit
      const where: ILeadWhereParams = { groupId }

      if (name) where.name = { like: name, mode: "insensitive" }
      if (status) where.status = status

      const leads = await this.leadsRepository.find({
        where, sortBy, orderBy, limit, offset, include: { groups: true }
      })

      const total = await this.leadsRepository.count(where)

      res.json({
        data: leads,
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
      const groupId = Number(req.params.groupId)
      const { leadId } = AddGroupLeadRequestSchema.parse(req.body)
      const updatedGroup = await this.groupsRepository.addLead(groupId, leadId)

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
      const updatedGroup = await this.groupsRepository.removeLead(groupId, leadId)

      res.json(updatedGroup)
    } 
    catch (error) 
    {
      next(error)
    }
  }
}