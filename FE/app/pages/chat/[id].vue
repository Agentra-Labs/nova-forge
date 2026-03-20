<script setup lang="ts">
import type { DefineComponent } from 'vue'
import type { ChatMessage, MessagePart } from '#shared/types/research'
import { extractTextFromParts } from '#shared/utils/chat'
import { useClipboard } from '@vueuse/core'
import { useToast } from '~/composables/useToast'
import ProseStreamPre from '../../components/prose/PreStream.vue'

const components = {
  pre: ProseStreamPre as unknown as DefineComponent
}

const route = useRoute()
const toast = useToast()
const clipboard = useClipboard()
const { mode } = useResearchMode()

function getFileName(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.split('/').pop() || 'file'
    return decodeURIComponent(filename)
  } catch {
    return 'file'
  }
}

const {
  dropzoneRef,
  isDragging,
  open,
  files,
  isUploading,
  uploadedFiles,
  removeFile,
  clearFiles
} = useFileUploadWithStatus(route.params.id as string)

const { data } = await useFetch(`/api/chats/${route.params.id}`, {
  cache: 'force-cache'
})
if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
}

const chatTitle = computed(() => data.value?.title || 'Untitled chat')
const chatMode = computed(() => (data.value?.mode || mode.value) as any)

const input = ref('')

const thread = useThreadController({
  chatId: data.value.id,
  initialMessages: data.value.messages as ChatMessage[],
  mode: chatMode,
  onError: (message) => {
    toast.add({
      title: 'Thread error',
      description: message,
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  }
})

const chatMessages = thread.messages
const isStreaming = thread.isStreaming
const isBusy = computed(() => thread.isBusy.value || isUploading.value)
const lastChatMessage = thread.lastMessage

async function handleSubmit(e: Event) {
  e.preventDefault()
  if (!input.value.trim() || isBusy.value) {
    return
  }

  const started = await thread.submit({
    text: input.value,
    files: uploadedFiles.value.length > 0 ? uploadedFiles.value : []
  })

  if (started) {
    input.value = ''
    clearFiles()
  }
}

async function retryLastTurn() {
  await thread.retry()
}

function stopAll() {
  thread.stop()
}

const copied = ref(false)

function copy(message: ChatMessage) {
  const text = extractTextFromParts(message.parts as any) || message.content || ''
  clipboard.copy(text)

  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div
    id="chat"
    class="min-h-screen bg-base-100"
  >
    <DashboardNavbar />

    <div class="flex h-[calc(100vh-4rem)] min-h-0 overflow-hidden">
      <div ref="dropzoneRef" class="relative flex min-h-0 flex-1 justify-center">
        <DragDropOverlay :show="isDragging" />

        <div class="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-1 flex-col px-4 sm:px-6 lg:px-10">
          <div class="min-h-0 flex-1 overflow-y-auto pt-6 pb-4 scroll-smooth">
            <div class="mx-auto flex w-full max-w-3xl flex-col gap-6">
                <div
                  v-for="message in chatMessages"
                  :key="message.id"
                  class="flex w-full"
                  :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
                >
                  <div
                    class="flex max-w-[92%] gap-4 sm:max-w-[85%]"
                    :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
                  >
                    <!-- Assistant Avatar -->
                    <div v-if="message.role === 'assistant'" class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-base-200 text-primary">
                      <Icon name="lucide:bot" class="h-4 w-4" />
                    </div>

                    <div class="min-w-0 flex-1">
                      <div
                        :class="message.role === 'user'
                          ? 'rounded-2xl bg-base-200/80 px-4 py-3 text-base-content'
                          : 'text-base-content pt-1'"
                      >
                        <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}${'state' in part ? `-${part.state}` : ''}`">
                          <Reasoning
                            v-if="part.type === 'reasoning'"
                            :text="part.text"
                            :is-streaming="part.state !== 'done'"
                          />
                          <MDCCached
                            v-else-if="part.type === 'text' && message.role === 'assistant'"
                            :value="part.text"
                            :cache-key="`${message.id}-${index}`"
                            :components="components"
                            :parser-options="{ highlight: false }"
                            class="prose prose-sm max-w-none *:first:mt-0 *:last:mb-0"
                          />
                          <p v-else-if="part.type === 'text' && message.role === 'user'" class="whitespace-pre-wrap">
                            {{ part.text }}
                          </p>
                          <FileAvatar
                            v-else-if="part.type === 'file'"
                            :name="getFileName(part.url)"
                            :type="part.mediaType"
                            :preview-url="part.url"
                            class="mt-2 inline-flex"
                          />
                          <ClarificationRequest
                            v-else-if="part.type === 'clarification'"
                            :analysis="part"
                            class="mt-2"
                          />
                          <EvidenceDisplay
                            v-else-if="part.type === 'evidence'"
                            :audit="part"
                            class="mt-2"
                          />
                        </template>
                      </div>

                      <div v-if="message.role === 'assistant' && !isStreaming" class="mt-2 flex gap-2">
                        <button class="btn btn-ghost btn-xs gap-1 rounded-full text-base-content/50 hover:text-base-content" @click="copy(message)">
                          <Icon :name="copied ? 'lucide:copy-check' : 'lucide:copy'" class="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Research Stream -->
                <div v-if="thread.researchRunning.value || thread.researchContent.value" class="flex justify-start">
                  <div class="flex max-w-[92%] gap-4 sm:max-w-[85%] flex-row">
                    <div class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon name="lucide:sparkles" class="h-4 w-4" />
                    </div>
                    <div class="min-w-0 flex-1 pt-1">
                      <ResearchStream
                        :steps="thread.researchSteps.value"
                        :current-step="thread.researchCurrentStep.value"
                        :is-running="thread.researchRunning.value"
                        :content="thread.researchContent.value"
                        :error="thread.researchError.value"
                      />
                    </div>
                  </div>
                </div>

                <div v-if="isStreaming && lastChatMessage?.role === 'user'" class="flex justify-start">
                  <div class="flex max-w-[88%] gap-4 sm:max-w-[80%] flex-row">
                    <div class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-base-200 text-primary">
                      <Icon name="lucide:bot" class="h-4 w-4" />
                    </div>
                    <div class="pt-2 text-base-content/60">
                      <span class="loading loading-dots loading-sm"></span>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div class="sticky bottom-0 mt-auto bg-gradient-to-t from-base-100 via-base-100 to-transparent px-1 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-6 sm:px-2">
            <form @submit.prevent="handleSubmit" class="mx-auto max-w-3xl rounded-3xl bg-base-200/60 p-2 backdrop-blur-xl transition-all focus-within:bg-base-200">
              <div v-if="files.length > 0" class="mb-2 flex flex-wrap gap-2 p-2">
                <FileAvatar
                  v-for="fileWithStatus in files"
                  :key="fileWithStatus.id"
                  :name="fileWithStatus.file.name"
                  :type="fileWithStatus.file.type"
                  :preview-url="fileWithStatus.previewUrl"
                  :status="fileWithStatus.status"
                  :error="fileWithStatus.error"
                  removable
                  @remove="removeFile(fileWithStatus.id)"
                />
              </div>

              <!-- Error display -->
              <div v-if="thread.chatError.value" class="text-error text-sm mb-2 px-3">
                {{ thread.chatError.value }}
              </div>

              <textarea
                v-model="input"
                class="textarea textarea-ghost min-h-[3rem] w-full resize-none bg-transparent px-3 py-2 text-base focus:outline-none placeholder:text-base-content/40"
                @keydown.enter.prevent="handleSubmit"
                :placeholder="chatMode === 'deep'
                  ? 'Ask for stronger evidence, edge cases, or direct paper comparisons...'
                  : 'Ask for broader coverage, more papers, or alternate solution families...'"
                :disabled="isBusy"
                rows="1"
              />

              <div class="mt-1 flex items-center justify-between px-1">
                <div class="flex items-center gap-1 text-base-content/60">
                  <FileUploadButton :open="open" />
                  <ModelSelect />
                  <ResearchModeMenu />
                </div>

                <div class="flex gap-1.5">
                  <button 
                    v-if="isBusy"
                    type="button" 
                    class="btn btn-neutral btn-circle btn-sm p-0"
                    @click="stopAll()"
                  >
                    <Icon name="lucide:square" class="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button 
                    v-else-if="thread.hasMessages.value && !input"
                    type="button" 
                    class="btn btn-ghost btn-circle btn-sm p-0 text-base-content/60 hover:text-base-content"
                    @click="retryLastTurn()"
                    title="Regenerate"
                  >
                    <Icon name="lucide:rotate-cw" class="w-4 h-4" />
                  </button>
                  <button 
                    v-else
                    type="submit" 
                    class="btn btn-neutral btn-circle btn-sm p-0"
                    :disabled="isBusy || !input.trim()"
                  >
                    <span v-if="isUploading" class="loading loading-spinner loading-xs"></span>
                    <Icon v-else name="lucide:arrow-up" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
