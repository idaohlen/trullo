<template>
  <div class="mb-3 text-right">
    <Button @click="openCreateTaskModal">Add task</Button>
  </div>
  <Card class="p-2">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else class="grid grid-cols-2 gap-2">
      <Card
        v-for="task in (result?.tasks ?? []) as Task[]"
        :key="task.id as string"
        class="p-0 rounded-sm"
        :class="{ 'task-done': !!task.finishedAt }"
      >
        <div class="p-3">
          <div class="flex justify-between">
            <div
              class="font-bold hover:underline underline-offset-4 hover:cursor-pointer"
              @click="openTaskDetailsModal(task)"
            >
              {{ task.title }}
            </div>
          <StatusBadge :data="task.status" />
          </div>
          <div v-if="task.description" class="text-xs truncate text-gray-400">
            {{ getFirstLine(task.description) }}
          </div>
          <Badge
            v-if="task.user"
            variant="outline"
            class="text-[.7rem] bg-white mt-2"
            >{{ task.user.name }}</Badge
          >
        </div>
      </Card>
    </div>
  </Card>

  <CreateTaskModal
    :isOpen="isCreateTaskOpen"
    :onClose="closeCreateTaskModal"
    :onTaskSaved="refetchTasks"
    :task="currentTask"
  />

  <TaskDetailsModal
    :isOpen="isTaskDetailsOpen"
    :onClose="closeTaskDetailsModal"
    :task="currentTask"
    :onTaskDeleted="refetchTasks"
    :onOpenEdit="handleEdit"
  />
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import MarkdownIt from "markdown-it";

import { GET_TASKS } from "../api/graphql";
import type { GetTasksResult } from "@/types";
import type { Task } from "@/types";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import CreateTaskModal from "@/components/CreateTaskModal.vue";
import TaskDetailsModal from "@/components/TaskDetailsModal.vue";
import StatusBadge from "@/components/StatusBadge.vue";

const md = new MarkdownIt();

const { result, loading, error, refetch } = useQuery<GetTasksResult>(GET_TASKS);

const currentTask = ref<Task | null>(null);
const isCreateTaskOpen = ref(false);
const isTaskDetailsOpen = ref(false);

function refetchTasks() {
  refetch();
}

function openCreateTaskModal(task: Task | null = null) {
  currentTask.value = task;
  isCreateTaskOpen.value = true;
}

function closeCreateTaskModal() {
  isCreateTaskOpen.value = false;
  if (!isTaskDetailsOpen.value) currentTask.value = null;
}

function openTaskDetailsModal(task: Task) {
  currentTask.value = task;
  isTaskDetailsOpen.value = true;
}

function closeTaskDetailsModal() {
  isTaskDetailsOpen.value = false;
  if (!isCreateTaskOpen.value) currentTask.value = null;
}

function handleEdit(task: Task) {
  closeTaskDetailsModal();
  // Wait for the details modal to close before opening the edit modal
  setTimeout(() => {
    openCreateTaskModal(task);
  }, 0);
}

function getFirstLine(markdown: string): string {
  // Convert markdown to HTML
  const html = md.renderInline(markdown);
  // Create a temporary element to extract text
  const div = document.createElement("div");
  div.innerHTML = html;
  // Get the text content and split by line
  return div.textContent?.split("\n")[0] ?? "";
}
</script>
