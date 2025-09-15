<template>
  <LoaderOverlay v-if="loading" text="Creating task..." />
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create new task</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="handleCreateTask" class="grid gap-3">
        <div class="grid gap-2">
          <Label for="title">Title</Label>
          <Input v-model="title" placeholder="Title" id="title" />
        </div>
        <div class="grid gap-2">
          <Label for="description">Description</Label>
          <Textarea v-model="description" placeholder="Enter a task description here. Use markdown for formatting." id="description" />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" @Click="handleClose">Cancel</Button>
          <Button type="submit">Create task</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ADD_TASK } from "../api/graphql";
import Button from "./ui/button/Button.vue";
import Input from "./ui/input/Input.vue";
import Textarea from "./ui/textarea/Textarea.vue";
import Label from "./ui/label/Label.vue";
import LoaderOverlay from "@/components/LoaderOverlay.vue";

const props = defineProps(["isOpen", "onClose", "onTaskCreated"]);

const title = ref("");
const description = ref("");
const loading = ref(false);
const error = ref("");

const {
  mutate: addTask,
  onDone: onDone,
  onError: onError,
} = useMutation(ADD_TASK);

function handleClose() {
  title.value = "";
  description.value = "";
  props.onClose();
}

function handleCreateTask() {
  error.value = "";
  loading.value = true;

  addTask({
    title: title.value.trim(),
    description: description.value,
  });

  props.onTaskCreated();
}

onDone(async ({ data }) => {
  loading.value = false;
  title.value = "";
  description.value = "";
  handleClose();
});
</script>
