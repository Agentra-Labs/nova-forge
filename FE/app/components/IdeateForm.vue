<script setup lang="ts">
import type { IdeateJob, IdeateJobStart } from '#shared/types/research'

const props = defineProps<{
  chatId: string
}>()

const emit = defineEmits<{
  started: [jobId: string, arxivId: string]
  completed: [result: string]
  error: [message: string]
}>()

const toast = useToast()
const { csrf, headerName } = useCsrf()

const arxivInput = ref('')
const loading = ref(false)
const jobId = ref<string | null>(null)
const jobStatus = ref<IdeateJob | null>(null)
const pollInterval = ref<NodeJS.Timeout | null>(null)

const arxivPattern = /^(\d{4}\.\d{4,5}(v\d+)?|[a-z-]+\/\d{7})$/i
const isValidArxivId = computed(() => arxivPattern.test(arxivInput.value.trim()))

function extractArxivId(input: string): string {
  const trimmed = input.trim()
  // Direct arXiv ID
  if (arxivPattern.test(trimmed)) return trimmed
  
  // arXiv URL
  const urlMatch = trimmed.match(/arxiv\.org\/(?:abs|pdf)\/([^/]+)/i)
  if (urlMatch && urlMatch[1]) return urlMatch[1]
  
  return trimmed
}

async function startIdeate() {
  if (!isValidArxivId.value || loading.value) return
  
  const arxivId = extractArxivId(arxivInput.value)
  loading.value = true
  
  try {
    const response = await $fetch<IdeateJobStart>('/api/ideate', {
      method: 'POST',
      headers: { [headerName]: csrf },
      body: { arxiv_id: arxivId }
    })
    
    jobId.value = response.job_id
    emit('started', response.job_id, arxivId)
    
    // Start polling for status
    startPolling(response.job_id)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to start ideation'
    toast.add({
      title: 'Ideation failed',
      description: message,
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
    emit('error', message)
    loading.value = false
  }
}

async function pollJobStatus(id: string) {
  try {
    const status = await $fetch<IdeateJob>(`/api/ideate/${id}`)
    jobStatus.value = status
    
    if (status.status === 'completed' && status.result) {
      stopPolling()
      loading.value = false
      emit('completed', status.result)
    } else if (status.status === 'failed') {
      stopPolling()
      loading.value = false
      emit('error', status.error || 'Ideation failed')
    }
  } catch (err) {
    stopPolling()
    loading.value = false
    const message = err instanceof Error ? err.message : 'Failed to check status'
    emit('error', message)
  }
}

function startPolling(id: string) {
  pollInterval.value = setInterval(() => pollJobStatus(id), 2000)
}

function stopPolling() {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
  }
}

function cancel() {
  stopPolling()
  jobId.value = null
  jobStatus.value = null
  loading.value = false
}

onBeforeUnmount(() => {
  stopPolling()
})
</script>

<template>
  <div class="rounded-3xl bg-base-200/60 p-4 backdrop-blur-xl transition-all focus-within:bg-base-200">
    <div class="flex items-center gap-3 mb-4">
      <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon name="lucide:lightbulb" class="h-5 w-5" />
      </div>
      <div>
        <p class="text-[13px] font-bold uppercase tracking-wider text-base-content/80">Ideate Mode</p>
        <p class="text-xs text-base-content/40 italic">arXiv paper → product opportunities</p>
      </div>
    </div>

    <form @submit.prevent="startIdeate" class="space-y-4">
      <div class="relative">
        <input
          v-model="arxivInput"
          type="text"
          class="input input-ghost w-full bg-base-100/50 pr-20 text-base focus:bg-base-100 transition-colors placeholder:text-base-content/30"
          placeholder="arXiv ID or URL..."
          :disabled="loading"
        />
        <button
          type="submit"
          class="btn btn-neutral btn-sm absolute right-1.5 top-1.5 rounded-xl h-9 min-h-9"
          :disabled="!isValidArxivId || loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-xs"></span>
          <span v-else>Start</span>
        </button>
      </div>

      <div v-if="jobStatus" class="rounded-2xl bg-base-100/40 p-3 border border-base-300/30">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold uppercase tracking-wider text-base-content/40">Status</span>
          <span class="badge badge-sm uppercase text-[10px] font-bold tracking-tight" :class="{
            'badge-warning': jobStatus.status === 'queued',
            'badge-primary': jobStatus.status === 'running',
            'badge-success': jobStatus.status === 'completed',
            'badge-error': jobStatus.status === 'failed'
          }">
            {{ jobStatus.status }}
          </span>
        </div>
        
        <div v-if="loading" class="mt-2 flex justify-end">
          <button type="button" class="btn btn-ghost btn-xs h-7 min-h-7 text-[11px]" @click="cancel">
            Cancel Job
          </button>
        </div>
      </div>
    </form>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <span class="text-[10px] uppercase font-bold tracking-widest text-base-content/20">Examples</span>
      <button
        v-for="example in ['2301.07035', '2401.15884', '2312.11805']"
        :key="example"
        type="button"
        class="rounded-full bg-base-100/50 px-3 py-1 text-[11px] font-medium text-base-content/50 hover:bg-base-100 hover:text-base-content transition-colors"
        @click="arxivInput = example"
      >
        {{ example }}
      </button>
    </div>
  </div>
</template>
