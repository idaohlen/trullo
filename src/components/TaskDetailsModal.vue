<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent v-if="task">
      <DialogHeader>
        <DialogTitle>{{ task.title }}</DialogTitle>
      </DialogHeader>
      <div v-if="task.finishedAt" class="text-sm text-gray-500">Finished at {{ task.finishedAt }}</div>
      <Card class="p-2 rounded-sm" v-if="task.description">
        <vue-markdown :source="task.description" />
      </Card>
      <DialogFooter>
        <Button variant="outline" class="text-red-500" @click="handleDelete"><Trash /> Delete</Button>
        <Button variant="outline" @click="handleEdit"><Edit /> Edit</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import VueMarkdown from "vue-markdown-render";
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
import { Edit, Trash } from "lucide-vue-next";

const props = defineProps(["task", "isOpen", "onClose", "onTaskDeleted", "onOpenEdit"]);

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
