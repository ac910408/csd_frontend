<template>
  <header class="sticky top-0 z-40 h-14 border-b border-base-200 bg-base-100/80 backdrop-blur-md">
    <div class="flex items-center justify-between h-full px-4 lg:px-6">
      <div class="flex items-center gap-3">
        <BaseButton
          variant="ghost"
          size="sm"
          class="lg:hidden"
          @click="$emit('toggleSidebar')"
          aria-label="Menú"
        >
          <Menu class="size-5" />
        </BaseButton>

        <nav
          v-if="breadcrumbs?.length"
          class="hidden md:flex items-center gap-1 text-sm text-neutral"
        >
          <template v-for="(crumb, i) in breadcrumbs" :key="i">
            <ChevronRight v-if="i > 0" class="size-4" />
            <component
              :is="crumb.to ? 'a' : 'span'"
              :href="crumb.to"
              :class="
                i === breadcrumbs.length - 1
                  ? 'text-base-contrast font-medium'
                  : 'hover:text-base-contrast transition-colors'
              "
            >
              {{ crumb.label }}
            </component>
          </template>
        </nav>
      </div>
      <div class="flex-1" />
    </div>
  </header>
</template>

<script setup>
import { Menu, ChevronRight } from '@lucide/vue'
defineProps({ breadcrumbs: { type: Array, default: () => [] } })
defineEmits(['toggleSidebar'])
</script>
