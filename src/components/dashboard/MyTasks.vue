<template>
  <div class="flex gap-2 items-start mb-2">
    <h2 class="text-white text-3xl font-bold mb-2">My Tasks</h2>
    <Badge variant="outline" class="text-white">{{ tasks.length }}</Badge>
  </div>

  <Card class="p-4 w-full">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <div v-if="tasks.length < 1">
        You do not have any tasks assigned to you.
      </div>
      <div v-else class="grid grid-cols-2 gap-2">
        <TaskCardList :data="tasks" />
      </div>
    </div>
  </Card>

  <!-- Pagination Component -->
  <div
    v-if="tasksPagination && tasksPagination.totalCount > pageSize"
    class="flex justify-center my-6"
  >
    <Pagination
      :page="currentPage"
      :has-next-page="tasksPagination.hasNextPage"
      :total-count="tasksPagination.totalCount"
      :limit="pageSize"
      @set-page="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import type { PaginatedTasks } from "@/types";
import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import TaskCardList from "@/components/TaskCardList.vue";
import Pagination from "../Pagination.vue";
import { GET_MY_TASKS } from "@/api/task.gql";

type QueryResult = {
  myTasks: PaginatedTasks;
};

const currentPage = ref(1);
const pageSize = ref(8);

const { result, loading, error } = useQuery<QueryResult>(GET_MY_TASKS, () => ({
  page: currentPage.value,
  limit: pageSize.value,
}));

const tasks = computed(() => result.value?.myTasks.items ?? []);
const tasksPagination = computed(() => result.value?.myTasks ?? null);

function handlePageChange(newPage: number) {
  currentPage.value = newPage;
}
</script>
