<template>
  <LoaderOverlay v-if="loading" text="Loading..." />
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit user</DialogTitle>
        <DialogDescription class="sr-only">
          Edit user information and settings.
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSaveUser" class="grid gap-3">
        <div v-if="error" class="p-3 rounded bg-red-50 text-red-800 text-sm">
          {{ error }}
        </div>
        <div class="grid gap-2">
          <Label for="name">Name</Label>
          <Input v-model="name" placeholder="Name" id="name" />
        </div>
        <div class="grid gap-2">
          <Label for="name">Email</Label>
          <Input v-model="email" placeholder="Email" id="email" />
        </div>
        <div v-if="!isAdmin" class="grid gap-2">
          <Label for="currentPassword">Current Password</Label>
          <p class="text-[.7rem] text-muted-foreground ">Required when changing email or password</p>
          <Input v-model="currentPassword" type="password" placeholder="Enter current password" id="currentPassword" />
        </div>
        <div class="grid gap-2">
          <Label for="password">New Password</Label>
          <Input v-model="password" type="password" placeholder="Enter new password" id="password" />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" @Click="handleClose">
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, type PropType } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { UPDATE_USER } from "../api/graphql";
import type { User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import LoaderOverlay from "./LoaderOverlay.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const { mutate: updateUser } = useMutation(UPDATE_USER);

const props = defineProps({
  isOpen: Boolean,
  onClose: {
    type: Function,
    default: () => {},
  },
  onUserSaved: {
    type: Function,
    default: () => {},
  },
  user: {
    type: Object as PropType<User | null>,
    default: null,
  },
});

const loading = ref(false);
const error = ref("");

const name = ref("");
const email = ref("");
const password = ref("");
const currentPassword = ref("");

// Check if current user is admin
const isAdmin = computed(() => authStore.user?.role === "ADMIN");

watch(
  () => props.user,
  (user) => {
    if (user) fillForm(user);
    else handleClose();
  },
  { immediate: true }
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.user) fillForm(props.user);
  }
);

function fillForm(user: User) {
  name.value = user.name || "";
  email.value = user.email || "";
  password.value = "";
  currentPassword.value = "";
}

function resetForm() {
  name.value = "";
  email.value = "";
  password.value = "";
  currentPassword.value = "";
}

function handleClose() {
  resetForm();
  props.onClose();
}

async function handleSaveUser() {
  error.value = "";
  loading.value = true;

  try {
    if (props.user) {
      await updateUser({
        id: props.user.id,
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value || undefined,
        currentPassword: currentPassword.value || undefined,
      });
    }
    handleClose();
    props.onUserSaved();
  } catch (e: any) {
    error.value = e?.message || "Failed to save user.";
    console.error("Save user error:", e);
  } finally {
    loading.value = false;
  }
}
</script>
