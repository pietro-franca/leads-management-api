import { Lead } from "@prisma/client";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Unresponsive" | "Disqualified" | "Archived"

export interface ILeadWhereParams
{
  name?: {
    like?: string
    equals?: string
    mode?: "default" | "insensitive"
  },
  status?: LeadStatus,
  groupId?: number
}

export interface IFindLeadsParams
{
  where?: ILeadWhereParams
  sortBy?: "name" | "status" | "createdAt"
  orderBy?: "asc" | "desc"
  limit?: number
  offset?: number
  include?: {
    groups?: boolean
    campaigns?: boolean
  }
}

export interface ICreateLeadParams
{
  name: string
  email: string
  phone: string
  status?: LeadStatus
}

export interface ILeadsRepository 
{
  find: (params: IFindLeadsParams) => Promise<Lead[]>
  findById: (id: number) => Promise<Lead | null>
  count: (where: ILeadWhereParams) => Promise<number>
  create: (params: ICreateLeadParams) => Promise<Lead>
  updateById: (id: number, attributes: Partial<ICreateLeadParams>) => Promise<Lead | null>
  deleteById: (id: number) => Promise<Lead | null>
}