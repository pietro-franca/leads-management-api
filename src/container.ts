import { LeadsController } from "./controllers/LeadsController"
import { GroupsController } from "./controllers/GroupsController"
import { CampaignsController } from "./controllers/CampaignsController"
import { CampaignLeadsController } from "./controllers/CampaignLeadsController"
import { GroupLeadsController } from "./controllers/GroupLeadsController"
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository"
import { PrismaGroupsRepository } from "./repositories/prisma/PrismaGroupsRepository"
import { PrismaCampaignsRepository } from "./repositories/prisma/PrismaCampaignsRepository"

export const leadsRepository = new PrismaLeadsRepository()
export const groupsRepository = new PrismaGroupsRepository()
export const campaignsRepository = new PrismaCampaignsRepository()

export const leadsController = new LeadsController(leadsRepository)
export const groupsController = new GroupsController(groupsRepository)
export const groupLeadsController = new GroupLeadsController(groupsRepository, leadsRepository)
export const campaignsController = new CampaignsController(campaignsRepository)
export const campaignLeadsController = new CampaignLeadsController(campaignsRepository, leadsRepository)
