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

        <Select v-model="status">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem :value="statusOption" v-for="statusOption in statusValuesData.taskStatusValues || []" :key="statusOption">
                {{ statusOption }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

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
import { useQuery, useMutation } from "@vue/apollo-composable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ADD_TASK, GET_TASK_STATUS_VALUES } from "../api/graphql";
import Button from "./ui/button/Button.vue";
import Input from "./ui/input/Input.vue";
import Textarea from "./ui/textarea/Textarea.vue";
import Label from "./ui/label/Label.vue";
import LoaderOverlay from "@/components/LoaderOverlay.vue";

const props = defineProps(["isOpen", "onClose", "onTaskCreated"]);

const title = ref("");
const description = ref("");
const status = ref("");
const loading = ref(false);
const error = ref("");

const { result: statusValuesData } = useQuery(GET_TASK_STATUS_VALUES);

const {
  mutate: addTask,
  onDone: onDone,
  onError: onError,
} = useMutation(ADD_TASK);

function handleClose() {
  title.value = "";
  description.value = "";
  status.value = "";
  props.onClose();
}

async function handleCreateTask() {
  error.value = "";
  loading.value = true;
  try {
    await addTask({
      title: title.value.trim(),
      description: description.value,
      status: status.value || undefined,
    });
    props.onTaskCreated();
  } catch (e: any) {
    error.value = e?.message || "Failed to create task.";
    console.error("Create task error:", e);
  } finally {
    loading.value = false;
  }
}

onDone(async ({ data }) => {
  loading.value = false;
  title.value = "";
  description.value = "";
  status.value = "";
  handleClose();
});
</script>
