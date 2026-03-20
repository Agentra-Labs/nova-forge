<script setup lang="ts">
const sidebarOpen = useState<boolean>('sidebar-open', () => false)
</script>

<template>
  <div class="sticky top-0 z-20 bg-transparent">
    <div class="navbar mx-auto max-w-6xl min-h-14 px-3 sm:px-5 lg:hidden">
      <div class="flex-none flex items-center gap-1">
        <button class="btn btn-ghost btn-square" @click="sidebarOpen = true">
          <Icon name="lucide:menu" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
