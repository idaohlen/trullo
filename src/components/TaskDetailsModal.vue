<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent v-if="task" class="gap-0">
      <DialogHeader class="flex flex-row justify-between items-center mr-4">
        <DialogTitle>{{ task.title }}</DialogTitle>
        <StatusBadge :data="task.status" />
        <DialogDescription class="sr-only">
          Task details for {{ task.title }}
        </DialogDescription>
      </DialogHeader>
      <div class="pb-6">
        <div v-if="task.assignee" class="text-[.8rem] mb-2">
          Assigned to
          <Badge variant="outline" class="bg-white mt-2 ml-1">
            {{ task.assignee.name }}
          </Badge>
        </div>

        <Card class="p-3 text-sm rounded-sm" v-if="task.description">
          <vue-markdown :source="task.description" />
        </Card>
      </div>
      <div
        v-if="task.finishedAt"
        class="flex gap-2 items-center justify-end text-sm text-green-600"
      >
        <Check class="size-4" />
        <div class="text-[.8rem]">
          Finished
          <span v-if="task.finisher">
            by <span class="font-semibold">{{ task.finisher.name }}</span>
          </span>
          at
          <Badge class="bg-green-100 text-green-700">
            {{ format(new Date(task.finishedAt), "ii MMM yyyy HH:mm") }}
          </Badge>
        </div>
      </div>
      <DialogFooter class="mt-2">
        <div class="w-full flex justify-between items-center gap-2">
          <div class="flex gap-2 text-[.8rem] text-gray-500">
            <CalendarPlus class="size-4" />Created
            {{ format(new Date(task.createdAt), "ii MMM yyyy HH:mm") }}
          </div>
          <div class="flex gap-2">
            <Button
              variant="outline"
              class="text-red-500"
              @click="handleDelete"
            >
              <Trash /> Delete</Button
            >
            <Button variant="outline" @click="handleEdit(task)"
              ><Edit /> Edit</Button
            >
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import VueMarkdown from "vue-markdown-render";
import { format } from "date-fns";
import type { Task } from "@/types";
import { DELETE_TASK, GET_TASKS } from "../api/task.gql";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarPlus, Check, Edit, Trash } from "lucide-vue-next";
import { Badge } from "./ui/badge";
import StatusBadge from "./StatusBadge.vue";
import { useModal } from "@/composables/useModal";
const { openModal } = useModal();

const props = defineProps(["task", "isOpen", "onClose", "onTaskDeleted"]);

const { mutate: deleteTask } = useMutation(DELETE_TASK, {
  refetchQueries: [{ query: GET_TASKS }],
});

function handleEdit(task: Task) {
  openModal("CreateTask", task);
}

function handleClose() {
  props.onClose();
}

async function handleDelete() {
  await deleteTask({ id: props.task.id });
  if (props.onTaskDeleted) props.onTaskDeleted();
  props.onClose();
}
</script>
