import { z } from 'zod'

export const CHAT_MODE_VALUES = ['deep', 'wide'] as const
export const RESEARCH_RUN_MODE_VALUES = ['deep', 'wide', 'builder'] as const
export const RESEARCH_WORKFLOW_IDS = ['chained-research', 'literature-review'] as const

export const textMessagePartSchema = z.object({
  type: z.literal('text'),
  text: z.string().min(1)
})

export const reasoningMessagePartSchema = z.object({
  type: z.literal('reasoning'),
  text: z.string(),
  state: z.enum(['running', 'done'])
})

export const fileMessagePartSchema = z.object({
  type: z.literal('file'),
  url: z.string().url(),
  mediaType: z.string().min(1)
})

export const paperMessagePartSchema = z.object({
  type: z.literal('paper'),
  paper: z.any()
})

export const clarificationMessagePartSchema = z.object({
  type: z.literal('clarification'),
  confidence_score: z.number(),
  intent: z.string(),
  missing_context: z.array(z.string()),
  clarification_questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()).optional()
  })),
  best_guess_plan: z.string().optional()
})

export const evidenceMessagePartSchema = z.object({
  type: z.literal('evidence'),
  claims: z.array(z.any()),
  audit_summary: z.any()
})

export const messagePartSchema = z.union([
  textMessagePartSchema,
  reasoningMessagePartSchema,
  fileMessagePartSchema,
  paperMessagePartSchema,
  clarificationMessagePartSchema,
  evidenceMessagePartSchema
])

export const chatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().optional(),
  parts: z.array(messagePartSchema).min(1)
})

export const createChatRequestSchema = z.object({
  id: z.string(),
  mode: z.enum(CHAT_MODE_VALUES),
  message: chatMessageSchema
})

export const sendChatRequestSchema = z.object({
  model: z.string().min(1),
  mode: z.enum(CHAT_MODE_VALUES).optional(),
  messages: z.array(chatMessageSchema).min(1)
})

export function extractTextFromParts(parts: Array<any>): string {
  return parts
    .filter((part): part is z.infer<typeof textMessagePartSchema> => part.type === 'text')
    .map(part => part.text.trim())
    .filter(Boolean)
    .join('\n\n')
}

export function extractFileParts(parts: Array<any>) {
  return parts.filter((part): part is z.infer<typeof fileMessagePartSchema> => part.type === 'file')
}

export function buildPromptFromParts(parts: Array<any>): string {
  const text = extractTextFromParts(parts)
  const files = extractFileParts(parts)

  if (!files.length) {
    return text
  }

  const attachmentContext = files
    .map((part, index) => `Attachment ${index + 1}: ${part.url} (${part.mediaType})`)
    .join('\n')

  return [text, attachmentContext].filter(Boolean).join('\n\n')
}
