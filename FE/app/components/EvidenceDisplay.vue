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
        case 'high': return 'badge-success'
        case 'medium': return 'badge-warning'
        case 'low': return 'badge-error'
        case 'unsupported': return 'badge-outline badge-error'
        default: return 'badge-ghost'
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
    <div class="evidence-display border border-base-300 rounded-lg p-4 mb-4">
        <!-- Audit summary -->
        <div class="flex items-center gap-4 mb-4 pb-3 border-b border-base-300">
            <span class="text-sm font-semibold">Evidence Audit</span>
            <div class="flex gap-2 text-xs">
                <span class="badge badge-success badge-sm">{{ summary.verified_high }} verified</span>
                <span class="badge badge-warning badge-sm">{{ summary.verified_medium }} partial</span>
                <span class="badge badge-error badge-sm">{{ summary.unsupported }} unsupported</span>
            </div>
        </div>

        <!-- Filter toggle -->
        <div class="flex items-center gap-2 mb-3">
            <label class="label cursor-pointer gap-2">
                <input type="checkbox" v-model="showOnlyUnsupported" class="checkbox checkbox-xs" />
                <span class="label-text text-xs">Show only unsupported claims</span>
            </label>
        </div>

        <!-- Claims list -->
        <div class="space-y-2">
            <div
                v-for="(claim, idx) in filteredClaims"
                :key="idx"
                class="claim-item bg-base-200 rounded p-2"
            >
                <!-- Claim header -->
                <div
                    class="flex items-start gap-2 cursor-pointer"
                    @click="toggleClaim(idx)"
                >
                    <Icon
                        :name="expandedClaims.has(idx) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
                        class="w-4 h-4 mt-1 flex-shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                        <p class="text-sm truncate">{{ claim.text }}</p>
                        <div class="flex gap-2 mt-1">
                            <span class="badge badge-sm" :class="confidenceColor(claim.overall_confidence)">
                                {{ claim.overall_confidence }}
                            </span>
                            <span v-if="claim.sources.length" class="text-xs opacity-50">
                                {{ claim.sources.length }} source(s)
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Expanded sources -->
                <div v-if="expandedClaims.has(idx)" class="mt-3 ml-6 space-y-2">
                    <div
                        v-for="(source, sidx) in claim.sources"
                        :key="sidx"
                        class="bg-base-300 rounded p-2 text-xs"
                    >
                        <div class="flex items-center gap-2 mb-1">
                            <span class="badge badge-xs" :class="confidenceColor(source.confidence)">
                                {{ source.confidence }}
                            </span>
                            <a
                                v-if="source.url"
                                :href="source.url"
                                target="_blank"
                                class="link link-primary truncate"
                            >
                                {{ source.title || source.url }}
                            </a>
                        </div>
                        <p class="opacity-70 italic">"{{ source.excerpt }}"</p>
                    </div>

                    <!-- Suggested revision -->
                    <div v-if="claim.suggested_revision" class="text-xs text-warning mt-2">
                        <span class="font-semibold">Suggested revision:</span>
                        {{ claim.suggested_revision }}
                    </div>
                </div>
            </div>
        </div>

        <!-- No claims -->
        <div v-if="filteredClaims.length === 0" class="text-sm opacity-50 text-center py-4">
            No claims to display
        </div>
    </div>
</template>
