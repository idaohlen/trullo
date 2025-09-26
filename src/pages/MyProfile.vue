<template>
  <h1 class="text-white text-4xl font-bold mb-4 tracking-wider">My profile</h1>
  <Card v-if="authStore.user" class="gap-2">
    <CardContent>
      <div class="flex justify-between mb-4">
        <div>
          <CardTitle>{{ authStore.user.name }}</CardTitle>
          <CardDescription>{{ authStore.user.email }}</CardDescription>
        </div>
        <Button variant="outline" @click="isEditUserOpen = true"
          ><Edit /> Edit profile</Button
        >
      </div>
      <Separator class="my-6" />
      <div class="flex justify-between">
        <h2 class="font-semibold text-xl mb-2">Danger Zone</h2>
        <ConfirmationModal
          title="Delete acount"
          description="Are you sure you want to delete your account? This action is permanent."
          @confirm="handleDelete(authStore.user.id)"
        >
          <Button variant="destructive">
            <TriangleAlert /> Delete my account
          </Button>
        </ConfirmationModal>
      </div>
    </CardContent>
  </Card>
  <Card v-else>
    <em>No user info available.</em>
  </Card>

  <EditUserModal
    :isOpen="isEditUserOpen"
    :onClose="closeEditUser"
    :user="authStore.user"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMutation, useApolloClient } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { DELETE_USER } from "@/api/graphql";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { Edit, TriangleAlert } from "lucide-vue-next";
import { Separator } from "@/components/ui/separator";
import EditUserModal from "@/components/EditUserModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";

const { mutate: deleteUser } = useMutation(DELETE_USER);
const { client } = useApolloClient();
const router = useRouter();
const authStore = useAuthStore();
const isEditUserOpen = ref(false);

function closeEditUser() {
  isEditUserOpen.value = false;
}

async function handleDelete(userId: string) {
  try {
    await deleteUser({ id: userId });
    authStore.setUser(null);
    router.push("/");
    await client.resetStore(); // Clear Apollo cache and refetch queries
  } catch (err) {
    console.error("Delete failed:", err);
  }
}
</script>
