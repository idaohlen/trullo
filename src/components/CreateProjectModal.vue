<template>
  <LoaderOverlay v-if="loading" text="Loading..." />
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ isEdit ? "Edit project" : "Create new project" }}
        </DialogTitle>
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
              :variant="memberId === ownerId ? 'default' : 'secondary'"
              :class="memberId === ownerId ? 'cursor-default' : 'cursor-pointer'"
              @click="removeMemberById(memberId)"
            >
              {{ getMemberDisplayName(memberId) }}
              <span v-if="memberId === ownerId" class="ml-1 text-xs">(owner)</span>
              <X v-else class="ml-1 h-3 w-3" />
            </Badge>
          </div>
        </div>

        <div v-if="isEdit" class="grid gap-2">
          <Label>Owner</Label>
          <BasePopover
            v-model:is-open="ownerPopoverOpen"
            v-model:search-value="ownerSearch"
            :options="users"
            :selected-value="ownerId"
            :display-text="displayText"
            search-placeholder="Search users..."
            empty-message="No user found."
            trigger-class="justify-between flex-1"
            content-class="w-[300px] p-0"
            :get-label="(owner: User) => owner.email"
            :get-value="(owner: User) => owner.id"
            :get-key="(owner: User) => owner.id"
            @select="(owner: User) => selectOwner(owner.id)"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

        <div class="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" @Click="handleClose">
            Cancel
          </Button>
          <Button type="submit">
            {{ isEdit ? "Save changes" : "Create project" }}
          </Button>
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

import { ADD_PROJECT, UPDATE_PROJECT, GET_MY_PROJECTS } from "../api/project.gql";
import { GET_USERS } from "../api/user.gql";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import LoaderOverlay from "@/components/LoaderOverlay.vue";
import MultiSelectPopover from "./MultiSelectPopover.vue";
import BasePopover from "./BasePopover.vue";
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
const ownerId = ref<string | null>(null);
const selectedMembers = ref<string[]>([]);
const userPopoverOpen = ref(false);
const ownerPopoverOpen = ref(false);
const userSearch = ref("");
const ownerSearch = ref("");

const users = computed(() => {
  return usersData.value?.users ?? [];
});

const owner = computed(() => {
  return users.value.find((u: User) => u.id === ownerId.value) || null;
});

const membersDisplayText = computed(() => {
  if (selectedMembers.value.length === 0) return "Select members";
  if (selectedMembers.value.length === 1) return "1 member selected";
  return `${selectedMembers.value.length} members selected`;
});

const displayText = computed(() => {
  return owner.value?.email ?? "Choose owner";
});

function addMember(user: User) {
  if (!selectedMembers.value.includes(user.id)) {
    selectedMembers.value.push(user.id);
  }
}

function removeMember(user: User) {
  // Prevent removing the current owner from members
  if (ownerId.value && user.id === ownerId.value) {
    return; // Don't remove the owner
  }
  selectedMembers.value = selectedMembers.value.filter((id) => id !== user.id);
}

function removeMemberById(memberId: string) {
  // Prevent removing the current owner from members
  if (ownerId.value && memberId === ownerId.value) {
    return; // Don't remove the owner
  }
  selectedMembers.value = selectedMembers.value.filter((id) => id !== memberId);
}

function getMemberDisplayName(memberId: string): string {
  const user = users.value.find((u: User) => u.id === memberId);
  return user?.email ?? user?.name ?? memberId;
}

function selectOwner(id: string) {
  const previousOwnerId = ownerId.value;
  
  // If there was a previous owner and it's different from the new owner
  if (previousOwnerId && previousOwnerId !== id) {
    // Add the previous owner to members if they're not already there
    if (!selectedMembers.value.includes(previousOwnerId)) {
      selectedMembers.value.push(previousOwnerId);
    }
  }
  
  ownerId.value = id;
  ownerPopoverOpen.value = false;
}

const authStore = useAuthStore();

const { result: usersData } = useQuery(GET_USERS);

const { mutate: addProject } = useMutation(ADD_PROJECT, {
  refetchQueries: [{ query: GET_MY_PROJECTS }],
});
const { mutate: updateProject } = useMutation(UPDATE_PROJECT, {
  refetchQueries: [{ query: GET_MY_PROJECTS }],
});

watch(
  () => props.project,
  (project) => {
    if (project) {
      title.value = project.title || "";
      description.value = project.description || "";
      
      // Ensure owner is included in members list when editing
      const members = [...(project.members || [])];
      if (project.ownerId && !members.includes(project.ownerId)) {
        members.push(project.ownerId);
      }
      
      selectedMembers.value = [...members];
      ownerId.value = project.ownerId || null;
    } else {
      title.value = "";
      description.value = "";
      selectedMembers.value = [];
      ownerId.value = null;
    }
  },
  { immediate: true }
);

function handleClose() {
  title.value = "";
  description.value = "";
  selectedMembers.value = [];
  ownerId.value = null;
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
      // Ensure owner is always included in members for update
      let finalMembers = [...selectedMembers.value];
      if (ownerId.value && !finalMembers.includes(ownerId.value)) {
        finalMembers.push(ownerId.value);
      }
      
      await updateProject({
        id: props.project.id,
        title: title.value.trim(),
        description: description.value || null,
        ownerId: ownerId.value || undefined,
        members: finalMembers.length > 0 ? finalMembers : null,
      });
    } else {
      await addProject({
        title: title.value.trim(),
        description: description.value || null,
        ownerId: authStore.user.id,
        members:
          selectedMembers.value.length > 0 ? selectedMembers.value : null,
      });
    }

    // Clear form
    title.value = "";
    description.value = "";
    selectedMembers.value = [];
    ownerId.value = null;

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
