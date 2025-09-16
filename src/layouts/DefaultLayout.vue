<template>
  <div class="wrapper bg-teal-700">
    <header
      class="header w-full p-3 bg-teal-800 border-teal-900 flex justify-between items-center"
    >
      <router-link to="/">
        <Button variant="secondary" class="font-bold uppercase">
          <ClipboardCheck /> Trullo
        </Button>
      </router-link>
      <div v-if="isLoggedIn">
        <router-link to="/dashboard">
          <Button variant="link" class="font-bold uppercase text-white">
            Dashboard
          </Button>
        </router-link>
        <Button variant="outline" @click="logout">
          Logout
        </Button>
      </div>
    </header>

    <main class="main p-12 mx-auto w-full h-full max-w-4xl">
      <router-view />
    </main>

    <footer class="footer p-3 bg-teal-900 border-teal-950 text-white/50 text-center text-sm">
      Trullo 2025
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation, useApolloClient } from "@vue/apollo-composable";
import { ClipboardCheck } from "lucide-vue-next";
import { LOGOUT_USER } from "../api/graphql";
import { useAuth } from "../composables/useAuth";
import { Button } from "@/components/ui/button";

const { mutate: logoutMutation } = useMutation(LOGOUT_USER);
const { isLoggedIn } = useAuth();

const router = useRouter();
const { client } = useApolloClient();

function logout() {
  logoutMutation().then(() => {
    client.resetStore();
    router.push("/");
  });
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
