<template>
  <div class="wrapper bg-teal-700">
    <header class="header w-full p-3 bg-teal-800 border-teal-900 flex justify-between items-center">
      <Button variant="secondary" class="font-bold uppercase">Trullo</Button>
      <Button v-if="isLoggedIn" variant="outline" @click="logout">Logout</Button>
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

import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoggedIn = ref(!!localStorage.getItem("token"));

function logout() {
  localStorage.removeItem("token");
  isLoggedIn.value = false;
  router.push("/");
}

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
