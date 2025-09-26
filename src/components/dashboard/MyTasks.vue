<template>
  <div class="flex gap-2 items-start mb-2">
    <h2 class="text-white text-3xl font-bold mb-2">My Tasks</h2>
    <Badge variant="outline" class="text-white">{{ tasks.length }}</Badge>
  </div>

  <Card class="p-2 w-full">
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
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import type { Task } from "@/types";
import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import TaskCardList from "@/components/TaskCardList.vue";
import { GET_MY_TASKS } from "@/api/task.gql";

type QueryResult = {
  myTasks: Task[];
};

const { result, loading, error } = useQuery<QueryResult>(GET_MY_TASKS);
console.log(result.value);

const tasks = computed(() => result.value?.myTasks ?? []);
</script>
