<template>
  <slot />
</template>

<script setup lang="ts">
import { provideModal } from "@/composables/useModal";
provideModal();
</script>
