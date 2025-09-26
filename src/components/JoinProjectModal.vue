<template>
  <LoaderOverlay v-if="loading" text="Loading..." />
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Join a project</DialogTitle>
        <DialogDescription class="sr-only">
          Join an existing project
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleJoinProject" class="grid gap-3">
        <BasePopover
          v-model:is-open="projectPopoverOpen"
          v-model:search-value="projectSearch"
          :options="availableProjects"
          :selected-value="selectedProjectId"
          :display-text="displayText"
          search-placeholder="Search projects..."
          empty-message="No project found."
          trigger-class="justify-between flex-1"
          content-class="w-[300px] p-0"
          :get-label="(project: Project) => project.title"
          :get-value="(project: Project) => project.id"
          :get-key="(project: Project) => project.id"
          @select="(project: Project) => selectProject(project.id)"
        />

        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

        <div class="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" @Click="handleClose"
            >Cancel</Button
          >
          <Button type="submit">Join project</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import type { Project } from "@/types";
import { useAuthStore } from "@/stores/auth";
import { useLoading } from "@/stores/loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  GET_PROJECTS,
  GET_MY_PROJECTS,
  JOIN_PROJECT,
} from "../api/project.gql";
import { Button } from "./ui/button";
import BasePopover from "./BasePopover.vue";
import LoaderOverlay from "./LoaderOverlay.vue";

const props = defineProps({
  isOpen: Boolean,
  onClose: {
    type: Function,
    default: () => {},
  },
  onJoined: {
    type: Function,
    default: () => {},
  },
});

const authStore = useAuthStore();
const { showLoading, hideLoading } = useLoading();

const loading = ref(false);
const error = ref("");
const selectedProjectId = ref<string | null>(null);
const projectPopoverOpen = ref(false);
const projectSearch = ref("");

const user = computed(() => authStore.user);

// Query all projects that the user is not already a member of
const { result: projectsData } = useQuery(GET_PROJECTS, { page: 1, limit: 50 }); // Get more projects for joining
const projects = computed(() => projectsData.value?.projects.items || []);

// Filter out projects where user is already a member or owner
const availableProjects = computed(() => {
  if (!projects.value || !user.value) return [];

  return projects.value.filter((project: Project) => {
    // Check if user is the owner
    if (project.ownerId === user.value!.id) return false;

    // Check if user is already a member
    if (project.members.includes(user.value!.id)) return false;

    return true;
  });
});

const selectedProject = computed(() => {
  return (
    availableProjects.value.find(
      (p: Project) => p.id === selectedProjectId.value
    ) || null
  );
});

const displayText = computed(() => {
  return selectedProject.value?.title ?? "Choose project to join";
});

const { mutate: joinProject } = useMutation(JOIN_PROJECT, {
  refetchQueries: [
    { query: GET_PROJECTS, variables: { page: 1, limit: 10 } }, 
    { query: GET_MY_PROJECTS, variables: { page: 1, limit: 6 } }
  ],
});

function selectProject(id: string) {
  selectedProjectId.value = id;
  projectPopoverOpen.value = false;
  error.value = "";
}

function handleClose() {
  selectedProjectId.value = null;
  error.value = "";
  projectSearch.value = "";
  props.onClose();
}

async function handleJoinProject() {
  if (!selectedProjectId.value) {
    error.value = "Please select a project to join";
    return;
  }

  const currentUserId = authStore.user?.id;
  if (!currentUserId) {
    error.value = "You must be logged in to join a project";
    return;
  }

  try {
    showLoading("Joining project...");
    error.value = "";

    // Use the dedicated joinProject mutation
    if (!selectedProjectId.value) {
      error.value = "No project selected";
      return;
    }

    await joinProject({
      projectId: selectedProjectId.value,
    });

    hideLoading();
    handleClose();
    props.onJoined();
  } catch (e: any) {
    error.value = e?.message || "Failed to join project";
    console.error("Join project error:", e);
    hideLoading();
  }
}
</script>
