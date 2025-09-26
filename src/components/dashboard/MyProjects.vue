<template>
  <div class="flex gap-4 justify-between mb-2">
    <div class="flex gap-2 items-start">
      <h2 class="text-white text-3xl font-bold mb-2">My Projects</h2>
      <Badge variant="outline" class="text-white">
        {{ projectsPagination?.totalCount ?? 0 }}
      </Badge>
    </div>
    <div class="flex gap-2">
      <Button
        variant="secondary"
        class="text-sky-700"
        @click="handleJoinProject"
        ><Users /> Join</Button
      >
      <Button
        variant="secondary"
        class="text-emerald-700"
        @click="handleCreateProject"
        ><CopyPlus /> Create new</Button
      >
    </div>
  </div>

  <Card class="p-4 w-full">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <template v-else>
      <div v-if="myProjects.length == 0">You do not have any projects.</div>
      <div v-else class="grid sm:grid-cols-2 gap-2">
        <RouterLink
          v-for="project in myProjects"
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="block"
        >
          <Card
            class="group p-4 hover:bg-gray-50 transition-colors cursor-pointer gap-2"
          >
            <div
              class="font-bold mb-2 group-hover:underline underline-offset-4"
            >
              {{ project.title }}
            </div>
            <div class="flex justify-between items-center">
              <Badge variant="secondary">
                {{ project.membersList.length }} members
              </Badge>
              <span class="text-sm text-gray-500">Go to project →</span>
            </div>
          </Card>
        </RouterLink>
      </div>
    </template>
  </Card>

  <!-- Pagination Component -->
  <div
    v-if="projectsPagination && projectsPagination.totalCount > pageSize"
    class="flex justify-center my-6"
  >
    <Pagination
      :page="currentPage"
      :has-next-page="projectsPagination.hasNextPage"
      :total-count="projectsPagination.totalCount"
      :limit="pageSize"
      @set-page="handlePageChange"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import type { PaginatedProjects } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useModal } from "@/composables/useModal";
import { GET_MY_PROJECTS } from "@/api/project.gql";
import { CopyPlus, Users } from "lucide-vue-next";
import Pagination from "../Pagination.vue";

const { openModal } = useModal();

type QueryResult = {
  myProjects: PaginatedProjects;
};

const currentPage = ref(1);
const pageSize = ref(6);

const {
  result: projectsData,
  loading,
  error,
} = useQuery<QueryResult>(GET_MY_PROJECTS, () => ({
  page: currentPage.value,
  limit: pageSize.value,
}));

const myProjects = computed(() => projectsData.value?.myProjects.items ?? []);
const projectsPagination = computed(() => projectsData.value?.myProjects ?? null);

function handleCreateProject() {
  openModal("CreateProject");
}

function handleJoinProject() {
  openModal("JoinProject");
}

function handlePageChange(newPage: number) {
  currentPage.value = newPage;
}
</script>
