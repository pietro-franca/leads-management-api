import { Group } from "@prisma/client";

export  interface ICreateGroupParams
{
  name: string
  description: string
}

export interface IGroupsRepository
{
  find: () => Promise<Group[]>
  findById: (id: number) => Promise<Group | null>
  create: (params: ICreateGroupParams) => Promise<Group>
  updateById: (id: number, params: Partial<ICreateGroupParams>) => Promise<Group | null>
  deleteById: (id: number) => Promise<Group | null>
  addLead: (groupId: number, leadId: number) => Promise<Group>
  removeLead: (groupId: number, leadId: number) => Promise<Group>
}