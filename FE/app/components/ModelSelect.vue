<script setup lang="ts">
const { model, models } = useModels()
const selectedModel = computed(() => models.find(m => m.value === model.value))
</script>

<template>
  <div class="relative inline-block w-auto">
    <select
      v-model="model"
      class="select select-sm select-ghost w-auto font-medium text-[12px] text-base-content/50 hover:text-base-content transition-colors px-2 h-8 min-h-8 focus:bg-transparent border-none focus:outline-none"
    >
      <option v-for="m in models" :key="m.value" :value="m.value">
        {{ m.label }}
      </option>
    </select>
  </div>
</template>
