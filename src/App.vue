<template>
  <div v-if="loading" class="flex items-center justify-center min-h-screen">
    <span>Loading...</span>
  </div>
  <div v-else>
    <router-view />

    <CreateTaskModal
      v-if="modalType === 'CreateTask'"
      :isOpen="true"
      :onClose="closeModal"
      :task="modalPayload"
    />
    <CreateProjectModal
      v-if="modalType === 'CreateProject'"
      :isOpen="true"
      :onClose="closeModal"
      :project="modalPayload"
    />
    <EditUserModal
      v-if="modalType === 'EditUser'"
      :isOpen="true"
      :onClose="closeModal"
      :user="modalPayload"
    />
    <TaskDetailsModal
      v-if="modalType === 'TaskDetails'"
      :isOpen="true"
      :onClose="closeModal"
      :task="modalPayload"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@vue/apollo-composable";
import { GET_ME } from "@/api/graphql";
import { useModal } from "@/composables/useModal";
import CreateTaskModal from "@/components/CreateTaskModal.vue";
import EditUserModal from "@/components/EditUserModal.vue";
import TaskDetailsModal from "@/components/TaskDetailsModal.vue";
import CreateProjectModal from "./components/CreateProjectModal.vue";

const { modalType, modalPayload, closeModal } = useModal();

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
