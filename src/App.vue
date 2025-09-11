<template>
  <div class="wrapper bg-teal-700">
    <header class="header w-full p-3 bg-teal-800 border-teal-900">
      <Button variant="secondary" class="font-bold uppercase">Trullo</Button>
    </header>

    <main class="main p-12 mx-auto w-full h-full max-w-4xl">
      <router-view />
    </main>

    <footer class="footer p-3 bg-teal-900 border-teal-950 text-white">
      Footer
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";

</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
