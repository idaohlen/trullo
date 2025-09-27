import { ref, computed } from "vue";
<template>
  <Card class="p-6 gap-4">
    <h2 class="text-2xl font-semibold">Projects</h2>
    <div class="relative w-full max-w-sm items-center mb-4">
      <Input
        id="search"
        v-model="search"
        type="text"
        placeholder="Search..."
        class="pl-10"
      />
      <span
        class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
      >
        <Search class="size-6 text-muted-foreground" />
      </span>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">
      <Alert variant="destructive">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>
          Error: {{ error.graphQLErrors[0].extensions.code }}
        </AlertTitle>
        <AlertDescription>
          {{ error.graphQLErrors[0].message }}
        </AlertDescription>
      </Alert>
    </div>
    <div v-else-if="projects.length == 0" class="p-6">No projects found.</div>
    <div v-else class="grid grid-cols-[1fr_2fr_auto_auto] gap-4 p-8 pt-0">
      <!-- Header -->
      <div class="font-medium text-gray-600">Title</div>
      <div class="font-medium text-gray-600">Owner</div>
      <div class="font-medium text-gray-600">Members</div>
      <div class="font-medium text-gray-600">Actions</div>

      <!-- User rows -->
      <template v-for="project in projects" :key="project.id">
        <div class="border-b border-gray-100 font-semibold text-sm">
          {{ project.title }}
        </div>
        <div class="border-b border-gray-100 text-gray-500 text-sm">
          {{ project.owner.email }}
        </div>
        <div class="border-b border-gray-100 font-bold text-sm text-center">
          {{ project.members.length + 1 }}
        </div>
        <div class="flex gap-2 pb-2">
          <ConfirmationModal
            title="Delete project"
            description="Are you sure you want to delete this project?"
            @confirm="handleDelete(project.id)"
          >
            <Button variant="destructive" size="icon" class="size-7">
              <Trash class="size-4" />
            </Button>
          </ConfirmationModal>

          <Button
            variant="outline"
            size="icon"
            class="size-7"
            @click="handleEdit(project)"
          >
            <Edit class="size-4" />
          </Button>
        </div>
      </template>
    </div>

    <!-- Pagination -->
    <div v-if="projectsPagination && projectsPagination.totalCount > pageSize">
      <Pagination
        :page="currentPage"
        :has-next-page="projectsPagination.hasNextPage"
        :total-count="projectsPagination.totalCount"
        :limit="pageSize"
        @set-page="handlePageChange"
      />
    </div>
  </Card>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { GET_PROJECTS, DELETE_PROJECT } from "@/api/project.gql";
import type { Project, PaginatedProjects } from "@/types";
import { useModal } from "@/composables/useModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Edit, Search, Trash } from "lucide-vue-next";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import Pagination from "@/components/Pagination.vue";
import { Input } from "../ui/input";
import { useDebouncedRef } from "@/composables/useDebouncedRef";

const { openModal } = useModal();

// Pagination state
const currentPage = ref(1);
const pageSize = ref(10);
const search = ref("");
const debouncedSearch = useDebouncedRef(search, 300);

const { result, loading, error } = useQuery<{ projects: PaginatedProjects }>(
  GET_PROJECTS,
  () => {
    const variables = {
      page: currentPage.value,
      limit: pageSize.value,
      search: debouncedSearch.value,
    };
    return variables;
  }
);
const { mutate: deleteProject } = useMutation(DELETE_PROJECT, {
  refetchQueries: () => [
    {
      query: GET_PROJECTS,
      variables: {
        page: currentPage.value,
        limit: pageSize.value,
      },
    },
    { query: GET_PROJECTS },
  ],
});

const projects = computed(() => result.value?.projects.items ?? []);
const projectsPagination = computed(() => result.value?.projects ?? null);

function handlePageChange(newPage: number) {
  currentPage.value = newPage;
}

async function handleDelete(projectId: string) {
  try {
    await deleteProject({ id: projectId });
  } catch (err) {
    console.error("Delete failed:", err);
  }
}

function handleEdit(project: Project) {
  openModal("CreateProject", project);
}
</script>
