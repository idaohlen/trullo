<template>
  <Card
    v-for="task in data"
    :key="task.id as string"
    class="p-0 rounded-sm"
    :class="{ 'task-done': !!task.finishedAt }"
  >
    <div class="p-3">
        <div
          class="font-bold hover:underline underline-offset-4 hover:cursor-pointer"
          @click="handleViewTask(task)"
        >
          {{ task.title }}
        </div>

      <div v-if="task.description" class="text-xs truncate text-gray-400">
        {{ getFirstLine(task.description) }}
      </div>
      <div class="flex items-end justify-between gap-2">
        <div>
          <Badge
          v-if="task.assignee"
          variant="outline"
          class="text-[.7rem] bg-white mt-2"
          >
          {{ task.assignee.name }}
          </Badge>
        </div>
        <StatusBadge :data="task.status" />
      </div>

    </div>
  </Card>
</template>

<script setup lang="ts">
import MarkdownIt from "markdown-it";
import type { Task } from "@/types";
import type { PropType } from "vue";
import { useModal } from "@/composables/useModal";
import { Card } from "./ui/card";
import Badge from "./ui/badge/Badge.vue";
import StatusBadge from "./StatusBadge.vue";

const { openModal } = useModal();
const md = new MarkdownIt();

defineProps({
  data: {
    type: Array as PropType<Task[]>,
    default: () => [],
  },
});

function handleViewTask(task: Task) {
  openModal("TaskDetails", task);
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
