import { Handler } from "express"
import { CreateLeadRequestSchema, GetLeadsRequestsSchema, UpdateLeadRequestSchema } from "./schemas/LeadsRequestSchema"
import { LeadsService } from "../services/LeadsService"

export class LeadsController
{
  constructor(private readonly leadsService: LeadsService) { }

  index: Handler = async (req, res, next) => {
    try 
    {
      const query = GetLeadsRequestsSchema.parse(req.query)
      const { 
        page = "1", 
        pageSize = "10", 
        name, 
        status, 
        sortBy = "name", 
        orderBy = "asc" 
      } = query

      const result = await this.leadsService.getAllLeadsPaginated({
        name, status, page: +page, pageSize: +pageSize, sortBy, orderBy
      })

      res.json(result)
    } 
    catch (error) 
    {
      next(error)
    }
  }

  create: Handler = async (req, res, next) => {
    try 
    {
      const body = CreateLeadRequestSchema.parse(req.body)
      const newLead = await this.leadsService.createLead(body)
      res.status(201).json(newLead)
    } 
    catch (error) 
    {
      next(error)
    }
  }

  show: Handler = async (req, res, next) => {
    try 
    {
      const lead = await this.leadsService.getLeadById(+req.params.id)
      res.json(lead)
    } 
    catch (error) 
    {
      next(error)
    }
  }

  update: Handler = async (req, res, next) => {
    try 
    {
      const id = Number(req.params.id)
      const body = UpdateLeadRequestSchema.parse(req.body)

      const updatedLead = await this.leadsService.updateLead(id, body)
      res.json(updatedLead)
    } 
    catch (error) 
    {
      next(error)
    }
  }

  delete: Handler = async (req, res, next) => {
    try 
    {
      const id = Number(req.params.id)
      const deletedLead = await this.leadsService.deleteLead(id)
      res.json(deletedLead)
    } 
    catch (error) 
    {
      next(error)
    }
  }
}