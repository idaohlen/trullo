<template>
  <h1 class="text-white text-2xl mb-4 font-bold tracking-wider">Admin</h1>
  <div v-if="loading" class="text-white">Loading...</div>
  <div v-else-if="error">
    <Alert variant="destructive">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle
        >Error: {{ error.graphQLErrors[0].extensions.code }}</AlertTitle
      >
      <AlertDescription>
        {{ error.graphQLErrors[0].message }}
      </AlertDescription>
    </Alert>
  </div>
  <Card v-else-if="users.length == 0"> No users found. </Card>
  <Card v-else class="p-6">
    <h2 class="font-semibold mb-4">Users</h2>
    <div class="grid grid-cols-[1fr_2fr_auto] gap-4 p-8 pt-0">
      <!-- Header -->
      <div class="font-medium text-gray-600">Name</div>
      <div class="font-medium text-gray-600">Email</div>
      <div class="font-medium text-gray-600">Actions</div>

      <!-- User rows -->
      <template v-for="user in users" :key="user.id">
        <div class="border-b border-gray-100 font-semibold text-sm">
          {{ user.name }}
        </div>
        <div class="border-b border-gray-100 text-gray-500 text-sm">
          {{ user.email }}
        </div>
        <div class="flex gap-2 pb-2">
          <ConfirmationModal
            title="Delete user"
            description="Are you sure you want to delete this user?"
            @confirm="handleDelete(user.id)"
          >
            <Button variant="destructive" size="icon" class="size-7">
              <Trash class="size-4" />
            </Button>
          </ConfirmationModal>

          <Button
            variant="outline"
            size="icon"
            class="size-7"
            @click="handleEditUser(user)"
          >
            <Edit class="size-4" />
          </Button>
        </div>
      </template>
    </div>
  </Card>

  <EditUserModal
    :isOpen="isEditUserOpen"
    :onClose="closeEditUser"
    :user="currentUser"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { GET_USERS, DELETE_USER, GET_TASKS } from "@/api/graphql";
import type { User } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Edit, Trash } from "lucide-vue-next";
import EditUserModal from "@/components/EditUserModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";

const { result, loading, error } = useQuery<{ users: User[] }>(GET_USERS);
const { mutate: deleteUser } = useMutation(DELETE_USER, {
  refetchQueries: [
    { query: GET_USERS },
    { query: GET_TASKS }
  ],
});

const users = computed(() => result.value?.users ?? []);

const currentUser = ref<User | null>(null);
const isEditUserOpen = ref(false);

function handleEditUser(user: User) {
  currentUser.value = user;
  isEditUserOpen.value = true;
}

function closeEditUser() {
  isEditUserOpen.value = false;
}

async function handleDelete(userId: string) {
  try {
    await deleteUser({ id: userId });
  } catch (err) {
    console.error("Delete failed:", err);
  }
}

</script>
