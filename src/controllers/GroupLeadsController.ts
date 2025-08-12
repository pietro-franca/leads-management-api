import { Handler } from "express";
import { Prisma } from "@prisma/client";
import { GetLeadsRequestsSchema } from "./schemas/LeadsRequestSchema";
import { prisma } from "../database";
import { addGroupLeadRequestSchema } from "./schemas/GroupsRequestSchema";

export class GroupLeadsController
{
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

      const pageNumber = Number(page)
      const pageSizeNumber = Number(pageSize)

      const where: Prisma.LeadWhereInput = {
        groups: {
          some: { id: groupId }
        }
      }

      if (name) where.name = { contains: name, mode: "insensitive" }
      if (status) where.status = status

      const leads = await prisma.lead.findMany({
        where,
        orderBy: { [sortBy]: orderBy },
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        include: {
          groups: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      })

      const total = await prisma.lead.count({ where })

      res.json({
        leads,
        meta: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          total,
          totalPages: Math.ceil(total / pageSizeNumber)
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
      const { leadId } = addGroupLeadRequestSchema.parse(req.body)
      const updatedGroup = await prisma.group.update({
        where: {
          id: Number(req.params.groupId)
        },
        data: {
          leads: {
            connect: { id: leadId }
          }
        },
        include: { leads: true }
      })

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
      const leadId = Number(req.params.leadId)
      const updatedGroup = await prisma.group.update({
        where: {
          id: Number(req.params.groupId)
        },
        data: {
          leads: {
            disconnect: { id: leadId }
          }
        },
        include: { leads: true }
      })

      res.json(updatedGroup)
    } 
    catch (error) 
    {
      next(error)
    }
  }
}