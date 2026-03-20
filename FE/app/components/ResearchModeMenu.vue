<script setup lang="ts">
const { mode, modes, currentModeInfo, isIdeateMode } = useResearchMode()

// Group modes for display
const researchModes = computed(() => modes.filter(m => m.group === 'research'))
const ideateMode = computed(() => modes.find(m => m.group === 'ideate'))
</script>

<template>
  <div class="dropdown dropdown-top dropdown-end">
    <button 
      type="button" 
      tabindex="0" 
      class="btn btn-ghost btn-sm h-8 min-h-8 rounded-lg px-2 text-[12px] font-medium transition-colors border-none" 
      :class="isIdeateMode ? 'text-primary' : 'text-base-content/50 hover:text-base-content'"
    >
      <Icon :name="currentModeInfo.icon" class="h-3.5 w-3.5" />
      <span>{{ currentModeInfo.label.split(' ')[0] }}</span>
    </button>

    <ul tabindex="0" class="menu dropdown-content z-[1] mb-2 w-64 rounded-2xl border border-base-300/60 bg-base-100 p-2 shadow-2xl">
      <!-- Research Modes -->
      <li class="menu-title px-2 py-1.5 text-[10px] uppercase tracking-widest text-base-content/40">
        Research Modes
      </li>
      <li v-for="option in researchModes" :key="option.value">
        <button
          type="button"
          class="flex items-start gap-3 rounded-xl py-2.5"
          :class="mode === option.value ? 'bg-base-200' : ''"
          @click="mode = option.value"
        >
          <Icon :name="option.icon" class="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />
          <span class="min-w-0">
            <span class="block text-sm font-semibold">{{ option.label }}</span>
            <span class="block text-xs leading-5 text-base-content/50">{{ option.description }}</span>
          </span>
        </button>
      </li>
      
      <!-- Divider -->
      <li class="my-1 h-px bg-base-300/40 mx-2"></li>
      
      <!-- Ideate Mode -->
      <li v-if="ideateMode">
        <button
          type="button"
          class="flex items-start gap-3 rounded-xl py-2.5"
          :class="isIdeateMode ? 'bg-primary/10' : ''"
          @click="mode = ideateMode.value"
        >
          <Icon :name="ideateMode.icon" class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span class="min-w-0">
            <span class="block text-sm font-semibold" :class="isIdeateMode ? 'text-primary' : ''">{{ ideateMode.label }}</span>
            <span class="block text-xs leading-5 text-base-content/50">{{ ideateMode.description }}</span>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>
