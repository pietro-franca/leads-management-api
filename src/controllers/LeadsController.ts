import { Handler } from "express"
import { CreateLeadRequestSchema, GetLeadsRequestsSchema, UpdateLeadRequestSchema } from "./schemas/LeadsRequestSchema"
import { HttpError } from "../errors/HttpError"
import { ILeadsRepository, ILeadWhereParams } from "../repositories/LeadsRepository"

export class LeadsController
{
  private leadsRepository: ILeadsRepository

  constructor(leadsRepository: ILeadsRepository)
  {
    this.leadsRepository = leadsRepository
  }

  index: Handler = async (req, res, next) => {
    try 
    {
      const query = GetLeadsRequestsSchema.parse(req.query)
      const { 
        page = "1", 
        pageSize = "10", 
        name, status, 
        sortBy = "name", 
        orderBy = "asc" 
      } = query

      const limit = Number(pageSize)
      const offset = (Number(page) - 1) * limit
      const where: ILeadWhereParams = {}

      if (name) where.name = { like: name, mode: "insensitive" }
      if (status) where.status = status

      const leads = await this.leadsRepository.find({ where, sortBy, orderBy, limit, offset })
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

  create: Handler = async (req, res, next) => {
    try 
    {
      const body = CreateLeadRequestSchema.parse(req.body)
      if (!body.status) body.status = "New"

      const newLead = await this.leadsRepository.create(body)
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
      const lead = await this.leadsRepository.findById(Number(req.params.id))
      if (!lead) throw new HttpError(404, "Lead Not Found!")

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

      const lead = await this.leadsRepository.findById(id)
      if (!lead) throw new HttpError(404, "Lead Not Found!")

      if (lead.status === "New" && body.status && body.status !== "Contacted")
        throw new HttpError(400, "A new leader must be contacted before their status is updated to other values")

      if (body.status && body.status === "Archived")
      {
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - lead.updatedAt.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays < 180) 
          throw new HttpError(400, "A lead can only be archived after 6 months of inactivity")
      }

      const updatedLead = await this.leadsRepository.updateById(id, body)

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
      const leadExists = await this.leadsRepository.findById(id)
      
      if (!leadExists) throw new HttpError(404, "Lead Not Found!")
      
      const deletedLead = await this.leadsRepository.deleteById(id)

      res.json(deletedLead)
    } 
    catch (error) 
    {
      next(error)
    }
  }
}