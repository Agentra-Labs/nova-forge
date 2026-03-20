<script setup lang="ts">
const { isStreaming = false } = defineProps<{
  text: string
  isStreaming?: boolean
}>()

const open = ref(false)

watch(() => isStreaming, () => {
  open.value = isStreaming
}, { immediate: true })

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/^#+\s+/gm, '') // Remove headers
}

function onToggle(event: Event) {
  const target = event.target as HTMLDetailsElement | null
  open.value = target?.open ?? false
}
</script>

<template>
  <div class="my-3 flex flex-col gap-2">
    <button 
      class="flex items-center gap-2 text-[13px] font-medium text-base-content/40 hover:text-base-content/60 transition-colors w-fit"
      @click="open = !open"
    >
      <Icon 
        :name="open ? 'lucide:chevron-down' : 'lucide:chevron-right'" 
        class="h-3.5 w-3.5" 
      />
      <span>{{ isStreaming ? 'Thinking...' : 'Thoughts' }}</span>
    </button>
    
    <div 
      v-if="open" 
      class="pl-5 border-l border-base-300/60 ml-1.5 flex flex-col gap-1.5"
    >
      <div v-for="(value, index) in cleanMarkdown(text).split('\n').filter(Boolean)" :key="index">
        <p class="whitespace-pre-wrap text-[13px] text-base-content/60 font-normal leading-relaxed">{{ value }}</p>
      </div>
    </div>
  </div>
</template>
