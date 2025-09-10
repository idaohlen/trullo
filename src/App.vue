<template>
  <div class="wrapper bg-teal-700">
    <header class="header w-full p-3 bg-teal-800 border-teal-900">
      <Button variant="secondary" class="font-bold uppercase">Trullo</Button>
    </header>

    <main class="main p-12 mx-auto w-full max-w-4xl">
      <div class="mb-3 text-right">
        <Button>Add task</Button>
      </div>
      <Card class="p-2">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">Error: {{ error.message }}</div>
      <div v-else class="grid grid-cols-2">
        <Card
          v-for="task in (result?.tasks ?? []) as Task[]"
          :key="task.id as string"
          class="p-0 rounded-sm"
        >
          <div class="p-3">
            <div class="flex justify-between">
              <div class="font-bold">{{ task.title }}</div>
              <Badge>{{ task.status }}</Badge>
            </div>
          <div v-if="task.description" class="text-sm">{{ task.description }}</div>
          <div v-if="task.user" class="text-sm">{{ task.user }}</div>
          </div>
        </Card>
      </div>
</Card>
    </main>

    <footer class="footer p-3 bg-teal-900 border-teal-950 text-white">
      Footer
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { GET_TASKS } from "./api/graphql";
import type { Task, GetTasksResult } from "../server/graphql/types";

import { Button } from "@/components/ui/button";
import { Card } from "./components/ui/card";
import Badge from "./components/ui/badge/Badge.vue";

const { result, loading, error } = useQuery<GetTasksResult>(GET_TASKS);
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
}
</style>
