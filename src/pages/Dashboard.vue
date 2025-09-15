<template>
  <div class="mb-3 text-right">
    <Button @click="toggleCreateTaskModal">Add task</Button>
  </div>
  <Card class="p-2">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else class="grid grid-cols-2 gap-2">
      <Card
        v-for="task in (result?.tasks ?? []) as Task[]"
        :key="task.id as string"
        class="p-0 rounded-sm"
      >
        <div class="p-3">
          <div class="flex justify-between">
            <div class="font-bold hover:underline underline-offset-4 hover:cursor-pointer" @click="toggleTaskDetailsModal(task)">{{ task.title }}</div>
            <Badge>{{ task.status }}</Badge>
          </div>
          <div v-if="task.description" class="text-xs truncate text-gray-400">
            {{ getFirstLine(task.description) }}
          </div>
          <div v-if="task.user" class="text-sm">{{ task.user }}</div>
        </div>
      </Card>
    </div>
  </Card>

  <CreateTaskModal
    :isOpen="isCreateTaskOpen"
    :onClose="toggleCreateTaskModal"
    :onTaskCreated="refetchTasks"
  />

  <TaskDetailsModal
    :isOpen="isTaskDetailsOpen"
    :onClose="toggleTaskDetailsModal"
    :task="currentTask"
  />
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import MarkdownIt from "markdown-it";

import { GET_TASKS } from "../api/graphql";
import type { Task, GetTasksResult } from "../../server/graphql/types";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import CreateTaskModal from "@/components/CreateTaskModal.vue";
import TaskDetailsModal from "@/components/TaskDetailsModal.vue";

const md = new MarkdownIt();

const { result, loading, error, refetch } = useQuery<GetTasksResult>(GET_TASKS);

const currentTask = ref<Task | null>(null);
const isCreateTaskOpen = ref(false);
const isTaskDetailsOpen = ref(false);

function refetchTasks() {
  refetch();
}

function toggleCreateTaskModal() {
  isCreateTaskOpen.value = !isCreateTaskOpen.value;
}

function toggleTaskDetailsModal(task: Task) {
  currentTask.value = task;
  console.log(currentTask.value)
  isTaskDetailsOpen.value = !isTaskDetailsOpen.value;
}

function getFirstLine(markdown: string): string {
  // Convert markdown to HTML
  const html = md.renderInline(markdown);
  // Create a temporary element to extract text
  const div = document.createElement("div");
  div.innerHTML = html;
  // Get the text content and split by line
  return div.textContent?.split('\n')[0] ?? "";
}
</script>
