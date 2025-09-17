<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent v-if="task">
      <DialogHeader class="flex flex-row justify-between items-center mr-4">
        <DialogTitle>{{ task.title }}</DialogTitle>
        <StatusBadge :data="task.status" />
      </DialogHeader>
      <div
        v-if="task.finishedAt"
        class="flex gap-2 items-center text-sm text-green-600"
      >
        <Check class="size-4" />
        <div class="text-[.8rem]">
          Finished
          <span v-if="task.user"
            >by <span class="font-semibold">{{ task.user.name }}</span></span
          >
          at
          <Badge class="bg-green-100 text-green-700">{{
            format(new Date(task.finishedAt), "ii MMM yyyy HH:mm")
          }}</Badge>
        </div>
      </div>
      <Card class="p-3 text-sm rounded-sm" v-if="task.description">
        <vue-markdown :source="task.description" />
      </Card>
      <div v-if="task.user" class="text-[.8rem]">
        Assigned to
        <Badge variant="outline" class="bg-white mt-2 ml-1">{{
          task.user.name
        }}</Badge>
      </div>
      <DialogFooter>
        <Button variant="outline" class="text-red-500" @click="handleDelete"
          ><Trash /> Delete</Button
        >
        <Button variant="outline" @click="handleEdit"><Edit /> Edit</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import VueMarkdown from "vue-markdown-render";
import { format } from "date-fns";
import { DELETE_TASK } from "../api/graphql";
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
import { Check, Edit, Trash } from "lucide-vue-next";
import { Badge } from "./ui/badge";
import StatusBadge from "./StatusBadge.vue";

const props = defineProps([
  "task",
  "isOpen",
  "onClose",
  "onTaskDeleted",
  "onOpenEdit",
]);

const { mutate: deleteTask } = useMutation(DELETE_TASK);

function handleClose() {
  props.onClose();
}

async function handleDelete() {
  await deleteTask({ id: props.task.id });
  props.onTaskDeleted();
  props.onClose();
}

async function handleEdit() {
  props.onOpenEdit(props.task);
  props.onClose();
}
</script>
