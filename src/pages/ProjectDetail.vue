<template>
  <div v-if="loading">Loading project...</div>
  <div v-else-if="error" class="text-white">
    <p class="font-bold text-xl">Error</p>
    {{ error.message }}

  </div>
  <div v-else-if="project" class="grid gap-4">
    <div class="flex gap-2 justify-between">
      <h1 class="text-3xl font-bold mb-4 text-white">{{ project.title }}</h1>
      <div class="flex gap-2 items-center justify-between">
        <!-- Owner-only actions -->
        <template v-if="isOwner()">
          <ConfirmationModal
            title="Delete project"
            description="Are you sure you want to delete the project? All tasks will be lost."
            @confirm="handleDelete"
          >
            <Button variant="ghost" class="text-white hover:text-red-500"><Trash /> Delete project</Button>
          </ConfirmationModal>
          <Button variant="secondary" @click="handleEdit()">
            <SquarePen />
            Edit project
          </Button>
        </template>
        
        <!-- Non-owner actions -->
        <template v-else>
          <ConfirmationModal
            title="Leave project"
            description="Are you sure you want to leave the project?"
            @confirm="handleLeave"
          >
            <Button variant="ghost" class="text-white hover:text-red-500"> <DoorOpen /> Leave project</Button>
          </ConfirmationModal>
        </template>
      </div>
    </div>

    <Card class="p-8 py-3">
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
    <Card class="mt-3 p-8 gap-6">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-semibold">Project Tasks</h2>
          <Badge variant="outline">tasks</Badge>
        </div>
        <Button @click="handleCreateTask" variant="outline" class="text-emerald-600 border-1 border-emerald-600/50 hover:bg-emerald-100 hover:text-emerald-700"><ClipboardPlus />
          Add task</Button>
      </div>
      <div class="grid sm:grid-cols-2 gap-2">
        <TaskCardList :data="projectTasks" />
      </div>
      
      <!-- Pagination -->
      <div v-if="tasksPagination && tasksPagination.totalCount > pageSize" class="mt-6">
        <Pagination
          :page="currentPage"
          :has-next-page="tasksPagination.hasNextPage"
          :total-count="tasksPagination.totalCount"
          :limit="pageSize"
          @set-page="handlePageChange"
        />
      </div>
    </Card>
  </div>
  <div v-else>
    <p>Project not found</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@vue/apollo-composable";
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
  DELETE_PROJECT,
  LEAVE_PROJECT,
  GET_PROJECT,
} from "@/api/project.gql";
import { GET_PROJECT_TASKS } from "@/api/task.gql";
import TaskCardList from "@/components/TaskCardList.vue";
import { useAuthStore } from "@/stores/auth";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { CalendarPlus, ClipboardPlus, DoorOpen, SquarePen, Trash } from "lucide-vue-next";
import Pagination from "@/components/Pagination.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { openModal } = useModal();

// Get the project ID from the URL parameter
const projectId = computed(() => route.params.id as string);

// Pagination state
const currentPage = ref(1);
const pageSize = ref(10);

const { result: tasksData } = useQuery(
  GET_PROJECT_TASKS,
  () => ({
    projectId: projectId.value,
    page: currentPage.value,
    limit: pageSize.value,
  }),
  () => ({ enabled: !!projectId.value })
);

const projectTasks = computed(() => tasksData.value?.projectTasks?.items ?? []);
const tasksPagination = computed(() => tasksData.value?.projectTasks ?? null);

const { result, loading, error } = useQuery(GET_PROJECT,
  // Variables - this is reactive, so when projectId changes, the query reruns
  () => ({ id: projectId.value }),
  // Options - only run the query if we have a project ID
  () => ({ enabled: !!projectId.value })
);

const project = computed(() => result.value?.project as Project | null);

const { mutate: deleteProject } = useMutation(DELETE_PROJECT, {
  refetchQueries: [{ query: GET_MY_PROJECTS }],
});

const { mutate: leaveProject } = useMutation(LEAVE_PROJECT, {
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

function handlePageChange(newPage: number) {
  currentPage.value = newPage;
}

async function handleLeave() {
  const currentProject = project.value;

  if (!currentProject) {
    console.error("Missing project data");
    return;
  }

  try {
    await leaveProject({ projectId: currentProject.id });
    router.push("/");
  } catch (error) {
    console.error("Failed to leave project:", error);
  }
}

function handleEdit() {
  // Double-check ownership before allowing edit
  if (!isOwner()) {
    console.error("Only project owners can edit projects");
    return;
  }
  openModal("CreateProject", project.value);
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
