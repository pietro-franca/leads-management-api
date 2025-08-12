import z from "zod";

export const CreateGroupRequestSchema = z.object({
  name: z.string(),
  description: z.string()
})

export const UpdateGroupRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional()
})

export const addGroupLeadRequestSchema = z.object({
  leadId: z.number()
})