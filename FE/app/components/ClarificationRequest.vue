<script setup lang="ts">
import type { ContextAnalysis } from '#shared/types/research'

const props = defineProps<{
    analysis: ContextAnalysis
}>()

const emit = defineEmits<{
    proceed: [answers: Record<string, string>]
    forceProceed: []
}>()

const answers = ref<Record<string, string>>({})

// Color based on confidence score
const confidenceColor = computed(() => {
    const score = props.analysis.confidence_score
    if (score >= 0.8) return 'text-success'
    if (score >= 0.6) return 'text-warning'
    return 'text-error'
})

const confidenceLabel = computed(() => {
    const score = props.analysis.confidence_score
    if (score >= 0.8) return 'High confidence'
    if (score >= 0.6) return 'Moderate confidence'
    return 'Low confidence - clarification needed'
})

function selectOption(questionId: string, option: string) {
    answers.value[questionId] = option
}

function submitAnswers() {
    emit('proceed', answers.value)
}
</script>

<template>
    <div class="clarification-request border border-base-300 rounded-lg p-4 mb-4">
        <!-- Confidence indicator -->
        <div class="flex items-center gap-2 mb-3">
            <div class="badge" :class="confidenceColor">
                {{ confidenceLabel }}
            </div>
            <span class="text-sm opacity-70">
                Score: {{ (analysis.confidence_score * 100).toFixed(0) }}%
            </span>
        </div>

        <!-- Intent -->
        <div class="mb-3">
            <span class="text-xs uppercase opacity-50">Detected Intent</span>
            <p class="text-sm">{{ analysis.intent }}</p>
        </div>

        <!-- Missing context -->
        <div v-if="analysis.missing_context.length > 0" class="mb-3">
            <span class="text-xs uppercase opacity-50">Missing Context</span>
            <ul class="text-sm list-disc list-inside">
                <li v-for="item in analysis.missing_context" :key="item">{{ item }}</li>
            </ul>
        </div>

        <!-- Clarification questions -->
        <div v-if="analysis.clarification_questions.length > 0" class="mb-4">
            <span class="text-xs uppercase opacity-50">Please Clarify</span>
            <div class="space-y-3 mt-2">
                <div v-for="q in analysis.clarification_questions" :key="q.id" class="form-control">
                    <label class="label">
                        <span class="label-text">{{ q.question }}</span>
                    </label>
                    <!-- Options provided -->
                    <div v-if="q.options" class="flex flex-wrap gap-2">
                        <button
                            v-for="opt in q.options"
                            :key="opt"
                            class="btn btn-sm"
                            :class="answers[q.id] === opt ? 'btn-primary' : 'btn-outline'"
                            @click="selectOption(q.id, opt)"
                        >
                            {{ opt }}
                        </button>
                    </div>
                    <!-- Free text input -->
                    <input
                        v-else
                        type="text"
                        class="input input-sm input-bordered w-full"
                        :placeholder="'Answer...'"
                        @input="(e) => answers[q.id] = (e.target as HTMLInputElement).value"
                    />
                </div>
            </div>
        </div>

        <!-- Best guess plan -->
        <div v-if="analysis.best_guess_plan" class="mb-4 p-3 bg-base-200 rounded">
            <span class="text-xs uppercase opacity-50">Best Guess Plan</span>
            <p class="text-sm">{{ analysis.best_guess_plan }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
            <button
                v-if="analysis.confidence_score >= 0.6"
                class="btn btn-outline btn-sm"
                @click="emit('forceProceed')"
            >
                Proceed with Best Guess
            </button>
            <button
                v-if="analysis.clarification_questions.length > 0"
                class="btn btn-primary btn-sm"
                :disabled="Object.keys(answers).length < analysis.clarification_questions.length"
                @click="submitAnswers"
            >
                Submit Answers & Proceed
            </button>
        </div>
    </div>
</template>
