<template>
  <div class="overlay">
    <div class="loader">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"/>
      </svg>
      <span class="text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.spinner {
  animation: spin 1s linear infinite;
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}
.path {
  stroke: #14b8a6;
  stroke-linecap: round;
}
.text {
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
}
@keyframes spin {
  100% { transform: rotate(360deg); }
}
</style>
