import { Lead } from "@prisma/client";
import { ICreateLeadParams, IFindLeadsParams, ILeadsRepository, ILeadWhereParams } from "../LeadsRepository";
import { prisma } from "../../database";

export class PrismaLeadsRepository implements ILeadsRepository
{
  async find(params: IFindLeadsParams): Promise<Lead[]>
  {
    const { where, sortBy, orderBy, offset, limit, include } = params
    return prisma.lead.findMany({
      where: {
        name: {
          contains: where?.name?.like,
          equals: where?.name?.equals,
          mode: where?.name?.mode
        },
        status: where?.status,
        groups: {
          some: {
            id: where?.groupId
          }
        }
      },
      orderBy: { [sortBy ?? "name"]: orderBy },
      skip: offset,
      take: limit,
      include: {
        groups: include?.groups,
        campaigns: include?.campaigns
      }
    })
  }

  async findById(id: number): Promise<Lead | null>
  {
    return prisma.lead.findUnique({ 
      where: { id },
      include: {
        groups: true,
        campaigns: true
      }
    })
  }

  async count(where: ILeadWhereParams): Promise<number>
  {
    return prisma.lead.count({
      where: {
        name: {
          contains: where?.name?.like,
          equals: where?.name?.equals,
          mode: where?.name?.mode
        },
        status: where?.status,
        groups: {
          some: {
            id: where?.groupId
          }
        }
      }
    })
  }

  async create(params: ICreateLeadParams): Promise<Lead>
  {
    return prisma.lead.create({ data: params })
  }

  async updateById(id: number, attributes: Partial<ICreateLeadParams>): Promise<Lead>
  {
    return prisma.lead.update({
      where: { id },
      data: attributes
    })
  }

  async deleteById(id: number): Promise<Lead>
  {
    return prisma.lead.delete({ where: { id } })
  }
  
}