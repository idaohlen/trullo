<template>
  <div v-if="loading">Loading project...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else-if="project" class="grid gap-4">
    <div class="flex gap-2 justify-between">
      <h1 class="text-3xl font-bold mb-4 text-white">{{ project.title }}</h1>
      <ConfirmationModal
        v-if="isOwner()"
        title="Delete project"
        description="Are you sure you want to delete the project? All tasks will be lost."
        @confirm="handleDelete"
      >
        <Button>Delete project</Button>
      </ConfirmationModal>
      <ConfirmationModal
        v-if="!isOwner()"
        title="Leave project"
        description="Are you sure you want to leave the project?"
        @confirm="handleLeave"
      >
        <Button>Leave project</Button>
      </ConfirmationModal>
    </div>

    <Card class="p-4 py-0">
      <Accordion type="single" collapsible class="w-full" defaultValue="info">
        <!-- Project Info -->
        <AccordionItem value="info">
          <AccordionTrigger>
            <h2 class="text-xl font-semibold">Project Details</h2>
          </AccordionTrigger>
          <AccordionContent class="flex flex-col gap-4 text-balance">
            <div class="space-y-4">
              <div v-if="project.description">
                <label class="text-sm font-medium text-gray-600">
                  Description
                </label>
                <p class="mt-1">{{ project.description }}</p>
              </div>
              <div class="flex gap-4 text-sm items-center text-gray-500">
                <div class="flex gap-2 items-center pr-4 border-r-1">
                  <label
                    class="flex gap-2 items-center font-medium text-gray-600"
                  >
                    <CalendarPlus class="size-4" /> Created
                  </label>
                  <div>{{ formatDate(project.createdAt) }}</div>
                </div>
                <div class="flex gap-2 items-center">
                  <label
                    class="flex gap-2 items-center font-medium text-gray-600"
                  >
                    <SquarePen class="size-4" /> Last Updated
                  </label>
                  <div>{{ formatDate(project.updatedAt) }}</div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <!-- Members -->
        <AccordionItem value="members">
          <AccordionTrigger>
            <h2 class="text-xl font-semibold">
              Members ({{ project.membersList.length }})
            </h2>
          </AccordionTrigger>
          <AccordionContent class="flex flex-col gap-4 text-balance">
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="member in project.membersList"
                :key="member.id"
                class="flex items-center gap-3"
              >
                <div
                  class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
                >
                  {{ member.name.charAt(0).toUpperCase() }}
                </div>
                <div class="text-sm">
                  <p class="font-medium">
                    {{ member.name }}
                    <Badge
                      v-if="member.id === project.ownerId"
                      variant="outline"
                      class="ml-1 px-[.3rem]"
                    >
                      owner
                    </Badge>
                  </p>
                  <p class="text-sm text-gray-600">{{ member.email }}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>

    <!-- Tasks -->
    <Card class="mt-3 p-6 gap-3">
      <div class="flex justify-between gap-2">
        <h2 class="text-xl font-semibold">Project Tasks</h2>
        <Button @click="handleCreateTask">Add task</Button>
      </div>
      <div class="grid sm:grid-cols-2 gap-2">
        <TaskCardList :data="projectTasks" />
      </div>
    </Card>
  </div>
  <div v-else>
    <p>Project not found</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";
import { useModal } from "@/composables/useModal";
import type { Project } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GET_MY_PROJECTS,
  GET_PROJECT_TASKS,
  DELETE_PROJECT,
  REMOVE_PROJECT_MEMBER,
} from "@/api/graphql";
import TaskCardList from "@/components/TaskCardList.vue";
import { useAuthStore } from "@/stores/auth";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { CalendarPlus, SquarePen } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { openModal } = useModal();

// Get the project ID from the URL parameter
const projectId = computed(() => route.params.id as string);

const { result: tasksData } = useQuery(
  GET_PROJECT_TASKS,
  () => ({
    projectId: projectId.value,
  }),
  () => ({
    enabled: !!projectId.value,
  })
);

const projectTasks = computed(() => tasksData.value?.projectTasks ?? []);

const { result, loading, error } = useQuery(
  gql`
    query GetProject($id: ID!) {
      project(id: $id) {
        id
        title
        description
        ownerId
        members
        membersList {
          id
          name
          email
        }
        createdAt
        updatedAt
      }
    }
  `,
  // Variables - this is reactive, so when projectId changes, the query reruns
  () => ({
    id: projectId.value,
  }),
  // Options - only run the query if we have a project ID
  () => ({
    enabled: !!projectId.value,
  })
);

const project = computed(() => result.value?.project as Project | null);

const { mutate: deleteProject } = useMutation(DELETE_PROJECT, {
  refetchQueries: [{ query: GET_MY_PROJECTS }],
});

const { mutate: removeProjectMember } = useMutation(REMOVE_PROJECT_MEMBER, {
  refetchQueries: [{ query: GET_MY_PROJECTS }],
});

function isOwner() {
  if (project.value && authStore.user) {
    if (project.value.ownerId === authStore.user.id) {
      return true;
    } else return false;
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

function handleCreateTask() {
  openModal("CreateTask", projectId.value);
}

async function handleLeave() {
  const currentProject = project.value;
  const userId = authStore.user?.id;

  if (!currentProject || !userId) {
    console.error("Missing project or user data");
    return;
  }

  try {
    await removeProjectMember({
      projectId: currentProject.id,
      userId: userId,
    });
    router.push("/");
  } catch (error) {
    console.error("Failed to leave project:", error);
  }
}
async function handleDelete() {
  try {
    await deleteProject({ id: project.value?.id });
  } catch (error) {
    console.error("Failed to delete project:", error);
  }
  router.push("/");
}
</script>
