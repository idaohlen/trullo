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
      <div v-if="isLoggedIn" class="flex gap-1">
        <router-link to="/">
          <Button variant="ghost" class="text-white">
            <Clipboard />
            Dashboard
          </Button>
        </router-link>
        <router-link to="/my-profile">
          <Button variant="ghost" class="text-white">
            <User />
            My Profile
          </Button>
        </router-link>
        <div v-if="isAdmin" class="contents">
        <router-link to="/admin">
          <Button variant="ghost" class="text-white">
            <LockKeyhole />
            Admin
          </Button>
        </router-link>
        </div>
        <Button variant="outline" @click="logout">
          <LogOut />
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
import { User, Clipboard, ClipboardCheck, LockKeyhole, LogOut } from "lucide-vue-next";
import { LOGOUT_USER } from "../api/auth.gql";
import { useAuth } from "../composables/useAuth";
import { Button } from "@/components/ui/button";

const { mutate: logoutMutation } = useMutation(LOGOUT_USER);
const { isLoggedIn, isAdmin } = useAuth();

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
