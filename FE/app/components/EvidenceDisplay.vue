<script setup lang="ts">
import type { EvidenceAudit } from '#shared/types/research'

const props = defineProps<{
    audit: EvidenceAudit
}>()

const expandedClaims = ref<Set<number>>(new Set())
const showOnlyUnsupported = ref(false)

// Toggle claim expansion
function toggleClaim(index: number) {
    if (expandedClaims.value.has(index)) {
        expandedClaims.value.delete(index)
    } else {
        expandedClaims.value.add(index)
    }
}

// Color for confidence level
function confidenceColor(level: string): string {
    switch (level) {
        case 'high': return 'text-success'
        case 'medium': return 'text-warning'
        case 'low': return 'text-error'
        case 'unsupported': return 'text-error font-semibold underline decoration-dotted'
        default: return 'text-base-content/40'
    }
}

// Filter claims
const filteredClaims = computed(() => {
    if (showOnlyUnsupported.value) {
        return props.audit.claims.filter(c => c.overall_confidence === 'unsupported')
    }
    return props.audit.claims
})

// Audit summary stats
const summary = computed(() => props.audit.audit_summary)
</script>

<template>
    <div class="evidence-display mt-4 border-t border-base-300/40 pt-4">
        <!-- Audit summary -->
        <div class="mb-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-base-content/40">
            <div class="flex items-center gap-1.5">
                <Icon name="lucide:shield-check" class="h-3.5 w-3.5" />
                <span>Evidence Audit</span>
            </div>
            
            <div class="flex items-center gap-3">
                <span class="text-success">{{ summary.verified_high }} verified</span>
                <span class="text-warning">{{ summary.verified_medium }} partial</span>
                <span v-if="summary.unsupported > 0" class="text-error">{{ summary.unsupported }} unsupported</span>
                
                <button 
                  class="ml-2 flex items-center gap-1.5 transition-colors hover:text-base-content" 
                  @click="showOnlyUnsupported = !showOnlyUnsupported"
                  :class="showOnlyUnsupported ? 'text-error' : 'text-base-content/40'"
                >
                  <Icon :name="showOnlyUnsupported ? 'lucide:eye-off' : 'lucide:eye'" class="h-3 w-3" />
                  <span>{{ showOnlyUnsupported ? 'Showing Errors' : 'Show All' }}</span>
                </button>
            </div>
        </div>

        <!-- Claims list -->
        <div class="space-y-3">
            <div
                v-for="(claim, idx) in filteredClaims"
                :key="idx"
                class="group"
            >
                <!-- Claim header -->
                <div
                    class="flex items-start gap-3 cursor-pointer hover:bg-base-200/40 rounded-xl p-2 -mx-2 transition-colors"
                    @click="toggleClaim(idx)"
                >
                    <Icon
                        :name="expandedClaims.has(idx) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
                        class="w-3.5 h-3.5 mt-1 flex-shrink-0 text-base-content/30"
                    />
                    <div class="flex-1 min-w-0">
                        <p class="text-[13px] leading-relaxed" :class="claim.overall_confidence === 'unsupported' ? 'text-error/90' : 'text-base-content/80'">
                            {{ claim.text }}
                        </p>
                        <div class="flex gap-3 mt-1 text-[11px]">
                            <span :class="confidenceColor(claim.overall_confidence)">
                                {{ claim.overall_confidence }}
                            </span>
                            <span v-if="claim.sources.length" class="text-base-content/30">
                                {{ claim.sources.length }} source(s)
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Expanded sources -->
                <div v-if="expandedClaims.has(idx)" class="mt-2 ml-6 space-y-3 pl-3 border-l border-base-300/40 py-1">
                    <div
                        v-for="(source, sidx) in claim.sources"
                        :key="sidx"
                        class="text-[12px] leading-relaxed"
                    >
                        <div class="flex items-center gap-2 mb-0.5">
                            <span class="text-[10px] uppercase font-bold tracking-tighter" :class="confidenceColor(source.confidence)">
                                {{ source.confidence }}
                            </span>
                            <a
                                v-if="source.url"
                                :href="source.url"
                                target="_blank"
                                class="link link-primary no-underline hover:underline truncate opacity-80"
                            >
                                {{ source.title || source.url }}
                            </a>
                        </div>
                        <p class="text-base-content/50 italic leading-snug">"{{ source.excerpt }}"</p>
                    </div>

                    <!-- Suggested revision -->
                    <div v-if="claim.suggested_revision" class="text-[12px] bg-warning/5 text-warning p-2 rounded-lg border border-warning/10">
                        <span class="font-bold">Revision:</span>
                        {{ claim.suggested_revision }}
                    </div>
                </div>
            </div>
        </div>

        <!-- No claims -->
        <div v-if="filteredClaims.length === 0" class="text-xs text-base-content/30 text-center py-4 italic">
            No audit claims for this section
        </div>
    </div>
</template>
