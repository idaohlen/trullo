<template>
  <h1>Trullo</h1>

  <h2>Tasks</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <div v-for="task in (result?.tasks ?? []) as Task[]" :key="task._id as string">
        <div>{{ task.title }}: {{ task.description }}</div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { GET_TASKS } from "./api/graphql";
import type { Task } from "../server/models/Task";

interface GetTasksResult {
  tasks: Task[];
}

const { result, loading, error } = useQuery<GetTasksResult>(GET_TASKS);
</script>

<style scoped>

</style>
