<template>
  <div
    class="w-full flex flex-col justify-center items-center flex-1 text-white gap-8"
  >
    <h1 class="text-4xl">
      Welcome to<br />
      <span class="uppercase font-bold text-5xl inline-flex items-center gap-2">
        <ClipboardCheck :size="32" /> Trullo!
      </span>
    </h1>

    <div v-if="!isLoggedIn" class="w-full max-w-xs">
      <LoginForm />
    </div>
    <div v-else class="w-full">
      <MyProjects class="mb-10" />
      <MyTasks />  
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClipboardCheck } from "lucide-vue-next";
import { useAuth } from "../composables/useAuth";
import LoginForm from "@/components/dashboard/LoginForm.vue";
import MyProjects from "@/components/dashboard/MyProjects.vue";
import MyTasks from "@/components/dashboard/MyTasks.vue";

const { isLoggedIn } = useAuth();
</script>
