<template>
  <dialog
    ref="dialogRef"
    :class="['m-auto rounded-lg bg-base-100 p-6 shadow-lg backdrop:bg-black/50', sizeMap[size]]"
    @click.self="handleBackdrop"
    @close="$emit('close')"
  >
    <div class="flex flex-col gap-4">
      <div class="flex items-start justify-between">
        <h2 class="text-xl font-bold text-base-contrast">{{ title }}</h2>
        <button
          type="button"
          class="-me-2 -mt-2 rounded-full p-2 text-neutral hover:bg-base-200 hover:text-base-contrast transition-colors"
          @click="close"
          aria-label="Cerrar"
        >
          <X class="size-5" />
        </button>
      </div>
      <div class="text-base-contrast">
        <slot />
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { X } from '@lucide/vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v),
  },
})

const emit = defineEmits(['close'])

const dialogRef = ref(null)

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

function close() {
  dialogRef.value?.close()
}

function handleBackdrop(e) {
  if (e.target === dialogRef.value) close()
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
    }
  },
)
</script>
