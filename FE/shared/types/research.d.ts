/**
 * TypeScript interfaces for the nova-forge backend.
 * Single source of truth for the contract between frontend and backend.
 */

export type ChatMode = 'deep' | 'wide'
export type ResearchMode = ChatMode | 'builder' | 'read' | 'ideate'

export interface ResearchQuery {
    goal: string
    primary_url?: string
    secondary_url?: string
    seed_arxiv_id?: string
    keywords?: string[]
    mode: ResearchMode
}

export interface PaperMeta {
    arxiv_id?: string
    ss_id?: string
    title: string
    authors: string[]
    abstract: string
    url: string
    year?: number
    citation_count?: number
    venue?: string
}

export interface PaperReview extends PaperMeta {
    relevance_score: number
    techniques: string[]
    claims: string[]
    limitations: string[]
    methods: string[]
    key_results: string[]
    review_pass: 1 | 2 | 3
    code_url?: string
    critique?: string
}

export interface ResearchStep {
    step_name: string
    step_number: number
    status: 'running' | 'completed' | 'failed'
    content?: string
}

export interface ResearchSession {
    session_id: string
    workflow_id?: string
    agent_id?: string
    created_at: string
    steps: ResearchStep[]
    papers: PaperReview[]
    synthesis?: string
}

// Message parts - extensible union type
export type MessagePart = 
    | { type: 'text', text: string }
    | { type: 'reasoning', text: string, state: 'running' | 'done' }
    | { type: 'file', url: string, mediaType: string }
    | { type: 'paper', paper: PaperReview }
    | { type: 'tool-weather', invocation: any }
    | { type: 'tool-chart', invocation: any }
    // Issue #2: Clarification request from Context Sentinel
    | { type: 'clarification',
        confidence: number,
        intent: string,
        missing_context: string[],
        questions: Array<{ id: string, question: string, options?: string[] }>,
        best_guess_plan?: string }
    // Issue #3: Evidence audit result
    | { type: 'evidence',
        claims: Array<{
            text: string
            sources: Array<{ excerpt: string; url: string; title?: string; confidence: 'high' | 'medium' | 'low' }>
            overall_confidence: 'high' | 'medium' | 'low' | 'unsupported'
            suggested_revision?: string
        }>,
        audit_summary: { 
            total_claims: number
            verified_high: number
            verified_medium: number
            verified_low: number
            unsupported: number 
        } }

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content?: string
    parts: MessagePart[]
    createdAt?: string | Date
}

/** Issue #2: Context analysis result from POST /research/clarify */
export interface ContextAnalysis {
    confidence_score: number
    intent: string
    scope: 'broad' | 'moderate' | 'narrow'
    constraints: string[]
    entities: string[]
    missing_context: string[]
    clarification_questions: Array<{ id: string, question: string, options?: string[] }>
    best_guess_plan?: string
    discovery_queries?: string[]
}

/** Issue #3: Evidence audit result from POST /research/audit */
export interface EvidenceAudit {
    claims: Array<{
        text: string
        sources: Array<{ excerpt: string; url: string; title?: string; confidence: 'high' | 'medium' | 'low' }>
        overall_confidence: 'high' | 'medium' | 'low' | 'unsupported'
        suggested_revision?: string
    }>
    audit_summary: {
        total_claims: number
        verified_high: number
        verified_medium: number
        verified_low: number
        unsupported: number
    }
}

/** Ideate job status from GET /ideate/{job_id} */
export interface IdeateJob {
    status: 'queued' | 'running' | 'completed' | 'failed'
    result: string | null
    error: string | null
}

/** Ideate job creation response from POST /ideate */
export interface IdeateJobStart {
    job_id: string
    arxiv_id: string
    status: 'queued'
}

/** Pipeline phase info for visualization */
export interface PipelinePhase {
    id: string
    name: string
    description: string
    status: 'pending' | 'running' | 'completed' | 'failed'
    duration?: number
}
