<script setup lang="ts">
/**
 * ResearchStream - Live step-by-step progress display during research.
 * Shows workflow phases, progress indicators, and intermediate results.
 */

defineProps<{
  steps: ReadonlyArray<{ name: string, status: string, content: string }>
  currentStep: string
  isRunning: boolean
  content: string
  error: string | null
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Step Progress -->
    <div v-if="steps.length > 0" class="flex flex-wrap gap-x-6 gap-y-2">
      <div 
        v-for="(step, i) in steps" 
        :key="i"
        class="flex items-center gap-2"
        :class="[
          step.status === 'completed' ? 'text-success/80' : 
          step.status === 'running' ? 'text-primary' : 
          step.status === 'failed' ? 'text-error' : 'text-base-content/30'
        ]"
      >
        <div class="relative flex items-center justify-center">
          <div v-if="step.status === 'running'" class="absolute h-2.5 w-2.5 rounded-full bg-primary animate-ping opacity-75"></div>
          <div 
            class="h-2 w-2 rounded-full" 
            :class="[
              step.status === 'completed' ? 'bg-success' : 
              step.status === 'running' ? 'bg-primary' : 
              step.status === 'failed' ? 'bg-error' : 'bg-base-content/20'
            ]"
          ></div>
        </div>
        <span class="text-[11px] font-bold uppercase tracking-wider">{{ step.name }}</span>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" role="alert" class="text-[13px] text-error flex items-center gap-2 bg-error/5 p-3 rounded-xl border border-error/10">
      <Icon name="lucide:alert-circle" class="h-4 w-4" />
      <span>{{ error }}</span>
    </div>

    <!-- Streaming Content -->
    <div v-if="content" class="text-base-content/90">
      <MDCCached
        :value="content"
        cache-key="research-stream"
        class="prose prose-sm max-w-none *:first:mt-0 *:last:mb-0"
      />
    </div>

    <!-- Loading placeholder when no content yet -->
    <div v-else-if="isRunning && !content" class="flex items-center gap-3">
      <span class="loading loading-dots loading-xs text-primary/60"></span>
      <span class="text-[13px] text-base-content/40 italic">Synthesizing findings...</span>
    </div>
  </div>
</template>
