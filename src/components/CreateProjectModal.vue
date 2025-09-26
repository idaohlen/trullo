<template>
  <LoaderOverlay v-if="loading" text="Loading..." />
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{
          isEdit ? "Edit project" : "Create new project"
        }}</DialogTitle>
        <DialogDescription class="sr-only">
          {{ isEdit ? "Edit project form" : "Create new project form" }}
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSaveProject" class="grid gap-3">
        <div class="grid gap-2">
          <Label for="title">Title</Label>
          <Input v-model="title" placeholder="Title" id="title" />
        </div>
        <div class="grid gap-2">
          <Label for="description">Description</Label>
          <Textarea
            v-model="description"
            placeholder="Use markdown for formatting your project description."
            id="description"
          />
        </div>

        <div class="grid gap-2">
          <Label>Members</Label>
          <MultiSelectPopover
            v-model:is-open="userPopoverOpen"
            v-model:search-value="userSearch"
            :options="users"
            :selected-values="selectedMembers"
            :display-text="membersDisplayText"
            search-placeholder="Search users..."
            empty-message="No users found."
            trigger-class="justify-between w-full"
            content-class="w-[300px] p-0"
            :get-label="(user: User) => user.email"
            :get-value="(user: User) => user.id"
            :get-key="(user: User) => user.id"
            @add="addMember"
            @remove="removeMember"
          />
          <div v-if="selectedMembers.length > 0" class="flex gap-1 flex-wrap">
            <Badge
              v-for="memberId in selectedMembers"
              :key="memberId"
              variant="secondary"
              class="cursor-pointer"
              @click="removeMemberById(memberId)"
            >
              {{ getMemberDisplayName(memberId) }}
              <X class="ml-1 h-3 w-3" />
            </Badge>
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

        <div class="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" @Click="handleClose"
            >Cancel</Button
          >
          <Button type="submit">{{
            isEdit ? "Save changes" : "Create project"
          }}</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, type PropType } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import type { Project, User } from "@/types";
import { useAuthStore } from "@/stores/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { GET_USERS, ADD_PROJECT, GET_MY_PROJECTS } from "../api/graphql";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import LoaderOverlay from "@/components/LoaderOverlay.vue";
import MultiSelectPopover from "./MultiSelectPopover.vue";
import Badge from "./ui/badge/Badge.vue";
import { X } from "lucide-vue-next";

const props = defineProps({
  isOpen: Boolean,
  onClose: {
    type: Function,
    default: () => {},
  },
  onProjectSaved: {
    type: Function,
    default: () => {},
  },
  project: {
    type: Object as PropType<Project | null>,
    default: null,
  },
});

const isEdit = computed(
  () =>
    props.project !== null &&
    typeof props.project?.id === "string" &&
    props.project.id.length > 0
);

const loading = ref(false);
const error = ref("");

// Form inputs
const title = ref("");
const description = ref("");
const selectedMembers = ref<string[]>([]);
const userPopoverOpen = ref(false);
const userSearch = ref("");

const users = computed(() => {
  return usersData.value?.users ?? [];
});

const membersDisplayText = computed(() => {
  if (selectedMembers.value.length === 0) return "Select members";
  if (selectedMembers.value.length === 1) return "1 member selected";
  return `${selectedMembers.value.length} members selected`;
});

function addMember(user: User) {
  if (!selectedMembers.value.includes(user.id)) {
    selectedMembers.value.push(user.id);
  }
}

function removeMember(user: User) {
  selectedMembers.value = selectedMembers.value.filter((id) => id !== user.id);
}

function removeMemberById(memberId: string) {
  selectedMembers.value = selectedMembers.value.filter((id) => id !== memberId);
}

function getMemberDisplayName(memberId: string): string {
  const user = users.value.find((u: User) => u.id === memberId);
  return user?.email ?? user?.name ?? memberId;
}

const authStore = useAuthStore();

const { result: usersData } = useQuery(GET_USERS);

const { mutate: addProject } = useMutation(ADD_PROJECT, {
  refetchQueries: [
    { query: GET_MY_PROJECTS },
  ],
});

watch(
  () => props.project,
  (project) => {
    if (project) {
      title.value = project.title || "";
      description.value = project.description || "";
    } else {
      title.value = "";
      description.value = "";
    }
  },
  { immediate: true }
);

function handleClose() {
  title.value = "";
  description.value = "";
  selectedMembers.value = [];
  props.onClose();
}

async function handleSaveProject() {
  error.value = "";
  
  // Validate required fields
  if (!title.value.trim()) {
    error.value = "Title is required";
    return;
  }
  
  if (!authStore.user?.id) {
    error.value = "User not authenticated";
    return;
  }

  loading.value = true;
  
  try {
    if (isEdit.value && props.project) {
      // TODO: Implement update project when you add UPDATE_PROJECT mutation
      console.log("Update project not implemented yet");
    } else {
      await addProject({
        title: title.value.trim(),
        description: description.value || null,
        ownerId: authStore.user.id,
        members: selectedMembers.value.length > 0 ? selectedMembers.value : null
      });
    }

    // Clear form
    title.value = "";
    description.value = "";
    selectedMembers.value = [];
    
    handleClose();
    props.onProjectSaved();
  } catch (e: any) {
    error.value = e?.message || "Failed to save project.";
    console.error("Save project error:", e);
  } finally {
    loading.value = false;
  }
}
</script>
