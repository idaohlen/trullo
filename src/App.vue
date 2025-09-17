<template>
  <div v-if="loading" class="flex items-center justify-center min-h-screen">
    <span>Loading user...</span>
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@vue/apollo-composable";
import { GET_ME } from "@/api/graphql";

const authStore = useAuthStore();
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const { onResult, onError } = useQuery(GET_ME);
    onResult(({ data }) => {
      if (data && data.me) {
        authStore.setUser(data.me);
      } else {
        authStore.setUser(null);
      }
      loading.value = false;
    });
    onError((err) => {
      error.value = err.message;
      authStore.setUser(null);
      loading.value = false;
    });
  } catch (e: any) {
    error.value = e?.message || "Failed to fetch user.";
    authStore.setUser(null);
    loading.value = false;
  }
});
</script>
