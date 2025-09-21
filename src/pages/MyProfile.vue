<template>
  <h1 class="text-white text-2xl mb-4 font-bold tracking-wider">My profile</h1>
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
        <Button variant="destructive"
          ><TriangleAlert /> Delete my account</Button
        >
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

const authStore = useAuthStore();
const isEditUserOpen = ref(false);

function closeEditUser() {
  isEditUserOpen.value = false;
}
</script>
