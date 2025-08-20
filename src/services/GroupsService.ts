import { HttpError } from "../errors/HttpError";
import { ICreateGroupParams, IGroupsRepository } from "../repositories/GroupsRepository";
import { ILeadsRepository, ILeadWhereParams } from "../repositories/LeadsRepository";
import { IGetLeadsWithPaginationParams } from "./LeadsService";

export class GroupsService
{
  constructor(
    private readonly groupsRepository: IGroupsRepository,
    private readonly leadsRepository: ILeadsRepository
  ) { }

  async getAllGroups()
  {
    return await this.groupsRepository.find()
  }

  async getGroupById(id: number)
  {
    const group = await this.groupsRepository.findById(id)
    if (!group) throw new HttpError(404, "Group Not Found!")
    
    return group
  }

  async createGroup(params: ICreateGroupParams)
  {
    const newGroup = await this.groupsRepository.create(params)
    return newGroup
  }

  async updateGroup(groupId: number, params: Partial<ICreateGroupParams>)
  {
    const updatedGroup = await this.groupsRepository.updateById(groupId, params)
    if (!updatedGroup) throw new HttpError(404, "Group Not Found!")
  
    return updatedGroup
  }

  async deleteGroup(groupId: number)
  {
    const deletedGroup = await this.groupsRepository.deleteById(groupId)
    if (!deletedGroup) throw new HttpError(404, "Group Not Found!")
  
    return deletedGroup
  }
  
  async getAllGroupLeadsPaginated(groupId: number, params: IGetLeadsWithPaginationParams)
  {
    const { page = 1, pageSize = 10, name, status, sortBy, orderBy } = params
    
    const limit = pageSize
    const offset = (page - 1) * limit
    const where: ILeadWhereParams = { groupId }

    if (name) where.name = { like: name, mode: "insensitive" }
    if (status) where.status = status

    const leads = await this.leadsRepository.find({
      where, sortBy, orderBy, limit, offset, include: { groups: true }
    })
    const total = await this.leadsRepository.count(where)

    return {
      data: leads,
      meta: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async addGroupLead(groupId: number, leadId: number)
  {
    const updatedGroup = await this.groupsRepository.addLead(groupId, leadId)
    return updatedGroup
  }

  async removeGroupLead(groupId: number, leadId: number)
  {
    const updatedGroup = await this.groupsRepository.removeLead(groupId, leadId)
    return updatedGroup
  }
}